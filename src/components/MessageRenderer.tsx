import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
  role: 'user' | 'assistant' | 'system'
}

export default function MessageRenderer({ content, role }: Props) {
  // For user messages, render as plain text
  if (role === 'user') {
    return <span className="whitespace-pre-wrap">{content}</span>
  }

  // Process content to handle <think> tags
  const processContent = (text: string) => {
    // Option 1: Remove <think> content entirely (uncomment this to hide thinking)
    // return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    
    // Option 2: Show thinking in a special collapsed section
    const parts: Array<{ type: 'text' | 'think', content: string }> = []
    let lastIndex = 0
    
    // Find all <think> tags
    const thinkRegex = /<think>([\s\S]*?)<\/think>/gi
    let match
    
    while ((match = thinkRegex.exec(text)) !== null) {
      // Add text before the think tag
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index).trim()
        if (beforeText) {
          parts.push({ type: 'text', content: beforeText })
        }
      }
      
      // Add the think content
      const thinkContent = match[1]?.trim()
      if (thinkContent) {
        parts.push({ type: 'think', content: thinkContent })
      }
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text after the last think tag
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex).trim()
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText })
      }
    }
    
    // If no think tags found, return original text
    if (parts.length === 0) {
      return [{ type: 'text', content: text }]
    }
    
    return parts
  }

  const contentParts = processContent(content)
  
  // If it's just a single text part, render normally
  if (contentParts.length === 1 && contentParts[0]?.type === 'text') {
    return renderMarkdown(contentParts[0]?.content || '')
  }

  // Render multiple parts with special handling for think sections
  return (
    <div className="space-y-2">
      {contentParts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            renderMarkdown(part.content)
          ) : (
            <ThinkingSection content={part.content} />
          )}
        </div>
      ))}
    </div>
  )

  function renderMarkdown(text: string) {
    return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-invert prose-sm max-w-none"
      components={{
        // Customize code blocks
        code: ({ node, className, children, ...props }: any) => {
          const inline = !className?.includes('language-')
          return !inline ? (
            <pre className="bg-gray-900 rounded-md p-3 overflow-x-auto border border-gray-700">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          )
        },
        // Customize headings
        h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-gray-100">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-gray-100">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-bold mb-1 text-gray-100">{children}</h3>,
        h4: ({ children }) => <h4 className="text-sm font-bold mb-1 text-gray-100">{children}</h4>,
        h5: ({ children }) => <h5 className="text-sm font-bold mb-1 text-gray-100">{children}</h5>,
        h6: ({ children }) => <h6 className="text-sm font-bold mb-1 text-gray-100">{children}</h6>,
        // Customize paragraphs
        p: ({ children }) => <p className="mb-2 text-gray-200 leading-relaxed">{children}</p>,
        // Customize lists
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-gray-200 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-gray-200 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-gray-200">{children}</li>,
        // Customize blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-brand-500 pl-4 my-2 italic text-gray-300 bg-gray-800/50 py-2 rounded-r">
            {children}
          </blockquote>
        ),
        // Customize tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full border-collapse border border-gray-600 text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-600 bg-gray-700 px-3 py-2 text-left font-semibold text-gray-200">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-600 px-3 py-2 text-gray-200">
            {children}
          </td>
        ),
        // Customize links
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-brand-400 hover:text-brand-300 underline"
          >
            {children}
          </a>
        ),
        // Customize horizontal rules
        hr: () => <hr className="border-gray-600 my-4" />,
        // Customize strong/bold text
        strong: ({ children }) => <strong className="font-bold text-gray-100">{children}</strong>,
        // Customize emphasis/italic text
        em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
      }}
    >
      {text}
    </ReactMarkdown>
    )
  }
}

// Component to display thinking sections
function ThinkingSection({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-gray-600 rounded-md bg-gray-800/50 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 text-left text-xs font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Thinking Process
        </span>
        <svg 
          className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="px-3 py-2 border-t border-gray-600 text-xs text-gray-300 bg-gray-900/50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert prose-xs max-w-none"
            components={{
              p: ({ children }) => <p className="mb-1 text-gray-300 leading-relaxed text-xs">{children}</p>,
              code: ({ children, ...props }: any) => (
                <code className="bg-gray-700 px-1 py-0.5 rounded text-xs" {...props}>
                  {children}
                </code>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside mb-1 text-gray-300 space-y-0.5 text-xs">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-1 text-gray-300 space-y-0.5 text-xs">{children}</ol>,
              li: ({ children }) => <li className="text-gray-300 text-xs">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
