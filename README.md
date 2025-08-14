# Guruji - AI Chat Application

A modern, multi-provider AI chat application built with React, TypeScript, and Tailwind CSS. Chat with different AI personas powered by OpenAI, Gemini, Groq, and Claude.

## 🚀 Features

### Multi-Provider AI Support
- **OpenAI GPT** - ChatGPT models (GPT-4o, GPT-4o-mini, etc.)
- **Google Gemini** - Gemini 1.5 Flash, Pro models
- **Groq** - Fast inference with Llama, Mixtral models
- **Anthropic Claude** - Claude 3.5 Sonnet, Claude 3 Opus/Sonnet/Haiku

### Chat Experience
- **WhatsApp-like Interface** - Familiar chat UI with sidebar navigation
- **Markdown Support** - Rich text rendering with code blocks, tables, lists
- **Persona-based Chats** - Pre-configured AI personalities
- **GitHub Integration** - Fetch profile data for custom personas

### Default Gurujis (AI Personas)
- **Hitesh** - Educator and developer advocate
- **Piyush** - Full-stack developer focused on product delivery  
- **Akshay** - Frontend engineer optimizing for UX and performance

### Smart Features
- **Settings Management** - Easy provider/model switching
- **API Key Validation** - Verify keys before saving
- **Error Handling** - User-friendly error messages
- **Chat Persistence** - Conversations saved to localStorage

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Typography plugin
- **Build Tool**: Vite
- **Markdown**: react-markdown + remark-gfm
- **Icons**: Heroicons (SVG)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for desired AI providers

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Persona
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔑 API Keys Setup

### OpenAI (ChatGPT)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key (starts with `sk-`)
3. Add billing information for usage

### Google Gemini
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key (starts with `AIza`)
3. Enable the Generative AI API

### Groq
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create an API key (starts with `gsk_`)
3. Free tier available with generous limits

### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/keys)
2. Create an API key (starts with `sk-ant-`)
3. Add billing for usage beyond free tier

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ChatLayout.tsx   # Main chat interface layout
│   ├── MessageRenderer.tsx # Markdown message rendering
│   ├── OnboardingModal.tsx # Initial setup modal
│   ├── SettingsModal.tsx    # Provider settings
│   ├── Sidebar.tsx          # Chat navigation
│   └── ThreadView.tsx       # Individual chat view
├── services/            # External API integrations
│   ├── ai/             # AI provider services
│   │   ├── claude.ts   # Anthropic Claude API
│   │   ├── gemini.ts   # Google Gemini API
│   │   ├── groq.ts     # Groq API
│   │   └── openai.ts   # OpenAI API
│   └── github.ts       # GitHub profile fetching
├── store/              # Redux state management
│   ├── slices/
│   │   ├── chatsSlice.ts    # Chat and persona state
│   │   └── settingsSlice.ts # App settings state
│   ├── hooks.ts        # Typed Redux hooks
│   └── store.ts        # Store configuration
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions
├── styles.css          # Global styles
└── main.tsx           # Application entry point
```

## 🎯 Usage

### First Time Setup
1. Open the application
2. Choose your preferred AI provider
3. Enter your API key
4. Select a model
5. Click "Save & Continue"

### Chatting with Default Gurujis
1. Click on any default Guruji (Hitesh, Piyush, Akshay)
2. Start typing your message
3. Press Enter or click Send
4. Chat history is automatically saved

### Changing Settings
1. Click the gear icon in the sidebar header
2. Update provider, API key, or model
3. Click "Save Changes"

### Understanding AI Responses
- **Regular text** renders with full markdown support
- **Code blocks** are syntax highlighted
- **Think sections** can be expanded to see AI reasoning
- **Tables and lists** are properly formatted

## 🔧 Configuration

### Environment Variables
The app doesn't use environment variables for API keys (they're entered via UI), but you can customize:

- `VITE_APP_TITLE` - App title (default: "Guruji")
- `VITE_DEFAULT_PROVIDER` - Default provider selection

### Customizing Default Personas
Edit `src/store/slices/chatsSlice.ts`:

```typescript
const defaultPersonas: Persona[] = [
  {
    id: 'guruji-custom',
    displayName: 'Your Guruji',
    githubUsername: 'your-github-username',
    systemPrompt: 'Your custom system prompt here...',
  },
  // Add more personas...
]
```

## 🚦 API Rate Limits

### Free Tiers (Approximate)
- **OpenAI**: $5 free credit for new accounts
- **Gemini**: 15 requests/minute, 1500 requests/day
- **Groq**: 14,400 requests/day, 30 requests/minute
- **Claude**: Limited free usage, then paid

### Best Practices
- Use Groq for fast, cost-effective responses
- Use Claude for high-quality reasoning
- Use GPT-4 for complex tasks
- Use Gemini for balanced performance

## 🐛 Troubleshooting

### Common Issues

**"Invalid API Key" Error**
- Verify key format matches provider requirements
- Check key has proper permissions
- Ensure billing is set up (if required)

**"Rate Limit Exceeded"**
- Wait for the rate limit to reset
- Switch to a different provider
- Upgrade to paid tier for higher limits

**Chat Not Loading**
- Check network connection
- Verify API key is still valid
- Try refreshing the page

**Messages Not Persisting**
- Check browser localStorage isn't full
- Ensure browser allows localStorage
- Try clearing browser data and re-setup

## 🔐 Security

- API keys are stored in browser localStorage
- No server-side storage of sensitive data
- All API calls made directly from browser
- Keys are validated before storage

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code style
- Add JSDoc comments for new functions
- Test with multiple AI providers
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Default Personas** inspired by popular developer educators
- **UI Design** inspired by WhatsApp and modern chat applications
- **Markdown Rendering** powered by react-markdown
- **Icons** from Heroicons

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include browser version and error messages

---

**Built with ❤️ for the developer community**
