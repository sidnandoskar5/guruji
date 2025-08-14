# Development Guide

## 🏗️ Architecture Overview

Guruji is built using modern React patterns with a focus on type safety, maintainability, and user experience.

### Core Technologies

- **React 18** - Component framework with hooks
- **TypeScript** - Type safety and developer experience
- **Redux Toolkit** - Predictable state management
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Application Flow

```
User Input → Redux Action → State Update → Component Re-render → UI Update
```

## 📁 Directory Structure

```
src/
├── components/           # React components
│   ├── ChatLayout.tsx   # Main layout with sidebar + chat
│   ├── MessageRenderer.tsx # Markdown rendering + think tags
│   ├── OnboardingModal.tsx # First-time setup
│   ├── SettingsModal.tsx    # Provider configuration
│   ├── Sidebar.tsx          # Navigation and persona list
│   └── ThreadView.tsx       # Individual chat interface
├── services/            # External API integrations
│   ├── ai/             # AI provider implementations
│   └── github.ts       # GitHub profile fetching
├── store/              # Redux state management
│   ├── slices/         # Feature-based state slices
│   ├── hooks.ts        # Typed useSelector/useDispatch
│   └── store.ts        # Store configuration
├── types.ts            # Global TypeScript definitions
└── utils/              # Shared utility functions
```

## 🔧 State Management

### Redux Slices

#### Settings Slice (`settingsSlice.ts`)
Manages AI provider configuration:
```typescript
interface SettingsState {
  provider: ProviderConfig // API key, model, provider name
}
```

#### Chats Slice (`chatsSlice.ts`)
Manages conversations and personas:
```typescript
interface ChatsState {
  personas: Record<string, Persona>     // AI personalities
  threads: Record<string, ChatThread>   // Conversations
  orderedThreadIds: string[]            // Thread order
  activeThreadId?: string               // Currently open thread
}
```

### Data Flow Examples

#### Sending a Message
1. User types in `ThreadView` input
2. `sendMessage()` creates user message
3. `addMessage` action dispatched
4. State updated, UI re-renders
5. AI API called with full conversation
6. Response received, assistant message added

#### Switching Providers
1. User opens settings modal
2. Selects new provider, enters API key
3. Key validated via provider API
4. `setProvider` action updates settings
5. Settings persisted to localStorage

## 🤖 AI Provider Integration

### Provider Interface

Each AI provider implements three functions:

```typescript
// Create chat completion
export async function create[Provider]ChatCompletion(params: CreateParams): Promise<string>

// Validate API key
export async function validate[Provider]Key(apiKey: string): Promise<boolean>

// List available models
export async function list[Provider]Models(apiKey: string): Promise<string[]>
```

### Error Handling Strategy

```typescript
// User-friendly error messages
if (res.status === 429) {
  errorMessage = '⏳ Rate limit exceeded. Please wait a moment and try again.'
} else if (res.status === 401) {
  errorMessage = '🔑 Invalid API key. Please check your API key.'
}
```

### Adding New Providers

1. **Create service file**: `src/services/ai/newprovider.ts`
2. **Implement interface**: Three required functions
3. **Add to types**: Update `ProviderName` union type
4. **Update components**: Add to provider dropdowns
5. **Add switch cases**: Update ThreadView message sending
6. **Test thoroughly**: Validate, list models, send messages

## 🎨 UI Components

### Component Patterns

#### Props Interface
```typescript
interface Props {
  // Required props
  threadId: string
  // Optional props with defaults
  isOpen?: boolean
  onClose?: () => void
}
```

#### State Management
```typescript
// Local state for UI
const [loading, setLoading] = useState(false)

// Redux state
const provider = useAppSelector(s => s.settings.provider)
const dispatch = useAppDispatch()
```

### Styling Guidelines

#### Tailwind Classes
- Use semantic color names: `text-gray-200`, `bg-gray-800`
- Responsive design: `sm:grid-cols-2`, `md:max-w-lg`
- Dark theme first: `prose-invert`, `border-gray-600`

#### Component Structure
```tsx
return (
  <div className="container-classes">
    <header className="header-classes">
      {/* Header content */}
    </header>
    
    <main className="main-classes">
      {/* Main content */}
    </main>
    
    <footer className="footer-classes">
      {/* Footer content */}
    </footer>
  </div>
)
```

## 🔄 Data Persistence

### localStorage Strategy

```typescript
// Settings persistence (automatic)
store.subscribe(() => {
  const settings = store.getState().settings
  localStorage.setItem('guruji_provider', JSON.stringify(settings.provider))
})

// Chat persistence (automatic)
store.subscribe(() => {
  const chats = store.getState().chats
  localStorage.setItem('guruji_chats', JSON.stringify({
    personas: chats.personas,
    threads: chats.threads,
    orderedThreadIds: chats.orderedThreadIds,
    activeThreadId: chats.activeThreadId,
  }))
})
```

### Data Hydration

```typescript
// On app start
useEffect(() => {
  dispatch(hydrateFromStorage())
}, [dispatch])
```

## 🎯 Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Code Splitting**: Lazy load components if needed
3. **Bundle Size**: Tree-shake unused dependencies
4. **State Updates**: Batch related updates

### Memory Management

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup subscriptions, timers, etc.
  }
}, [])
```

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Core Functionality
- [ ] Onboarding flow completes successfully
- [ ] All 4 providers work (OpenAI, Gemini, Groq, Claude)
- [ ] Settings can be changed and persist
- [ ] Messages send and receive correctly
- [ ] Markdown renders properly
- [ ] Think tags expand/collapse
- [ ] Chat history persists across sessions

#### Edge Cases
- [ ] Invalid API keys show proper errors
- [ ] Rate limits display user-friendly messages
- [ ] Network errors are handled gracefully
- [ ] Large messages render correctly
- [ ] Special characters in messages work

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Error Scenarios

Test these error conditions:
- Invalid/expired API keys
- Network connectivity issues
- Rate limit exceeded
- Malformed API responses
- localStorage quota exceeded

## 🔐 Security Best Practices

### API Key Handling
- Never log API keys
- Store only in localStorage
- Validate before storage
- Clear on logout/reset

### Input Validation
- Sanitize user inputs
- Validate API responses
- Handle malicious markdown
- Prevent XSS attacks

## 📊 Performance Monitoring

### Key Metrics
- Bundle size (< 500KB gzipped)
- First paint time (< 2s)
- Time to interactive (< 3s)
- API response times

### Optimization Tips
- Use `React.memo` for expensive components
- Implement virtual scrolling for long chat histories
- Lazy load AI provider modules
- Compress images and assets

## 🚀 Deployment

### Build Process
```bash
npm run build  # Creates optimized production build
npm run preview  # Preview production build locally
```

### Environment Setup
- Configure HTTPS (required for secure API calls)
- Set proper cache headers
- Enable gzip compression
- Configure CSP headers

### Monitoring
- Track API usage and costs
- Monitor error rates
- Watch performance metrics
- Check browser console for errors

## 🔄 Future Improvements

### Planned Features
- [ ] Voice input/output
- [ ] Image generation support
- [ ] Plugin system for custom providers
- [ ] Advanced conversation search
- [ ] Export/import conversations
- [ ] Team collaboration features

### Technical Debt
- [ ] Add comprehensive test suite
- [ ] Implement proper error boundaries
- [ ] Add performance monitoring
- [ ] Optimize bundle size further
- [ ] Improve accessibility (a11y)

---

This guide should help you understand the codebase and contribute effectively. For specific questions, check the README or create an issue!
