interface APIError {
  status: number
  message: string
  code?: string
  type?: string
}

export function parseAPIError(error: any, provider: string): string {
  // If it's already a formatted error message, return it
  if (typeof error === 'string') {
    return error
  }

  // Try to extract error details from the error object
  let status = 0
  let message = ''
  let code = ''
  let type = ''

  // Handle different error formats
  if (error.status) {
    status = error.status
  } else if (error.message && error.message.includes('API error:')) {
    // Parse error message like "DeepSeek API error: 402 - {...}"
    const match = error.message.match(/(\d+)\s*-\s*(.+)/)
    if (match) {
      status = parseInt(match[1])
      try {
        const errorData = JSON.parse(match[2])
        message = errorData.error?.message || errorData.message || match[2]
        code = errorData.error?.code || errorData.code || ''
        type = errorData.error?.type || errorData.type || ''
      } catch {
        message = match[2]
      }
    }
  }

  // Handle common error cases
  switch (status) {
    case 401:
      return `❌ **Authentication Error**\n\nYour API key for ${provider} is invalid or expired. Please check your API key in the settings.`
    
    case 402:
      return `💰 **Payment Required**\n\nYour ${provider} account has insufficient balance. Please add credits to your account to continue.`
    
    case 403:
      return `🚫 **Access Denied**\n\nYou don't have permission to use this ${provider} model or your account has been suspended.`
    
    case 404:
      return `🔍 **Model Not Found**\n\nThe ${provider} model you're trying to use doesn't exist or is not available.`
    
    case 429:
      return `⏱️ **Rate Limit Exceeded**\n\nYou've reached the rate limit for ${provider}. Please wait a moment before trying again.`
    
    case 500:
    case 502:
    case 503:
    case 504:
      return `🔧 **Service Unavailable**\n\n${provider} is currently experiencing technical difficulties. Please try again later.`
    
    default:
      if (code === 'insufficient_quota' || message.toLowerCase().includes('insufficient balance')) {
        return `💰 **Insufficient Credits**\n\nYour ${provider} account doesn't have enough credits. Please add more credits to continue.`
      }
      
      if (message.toLowerCase().includes('invalid api key')) {
        return `🔑 **Invalid API Key**\n\nPlease check your ${provider} API key in the settings.`
      }
      
      if (message.toLowerCase().includes('model not found')) {
        return `🔍 **Model Not Available**\n\nThe ${provider} model you selected is not available. Please choose a different model.`
      }
      
      // Return a generic but helpful error message
      return `❌ **${provider} Error**\n\n${message || 'An unexpected error occurred. Please try again.'}\n\n💡 **Troubleshooting:**\n• Check your API key in settings\n• Verify your account has sufficient credits\n• Try a different model if available`
  }
}
