# Environment Configuration

## Environment Variables

Guruji uses minimal environment variables as most configuration is done through the UI.

### Optional Variables

```bash
# App title (default: "Guruji")
VITE_APP_TITLE=Guruji

# Default provider selection (default: "openai")
VITE_DEFAULT_PROVIDER=openai

# Enable debug mode (default: false)
VITE_DEBUG_ENABLED=false
```

## API Key Management

**Important**: API keys are NOT stored in environment variables for security reasons. They are:

1. Entered through the application UI
2. Validated before storage
3. Stored in browser localStorage
4. Never transmitted to any server

### Supported API Key Formats

- **OpenAI**: `sk-...` (starts with sk-)
- **Gemini**: `AIza...` (starts with AIza)
- **Groq**: `gsk_...` (starts with gsk_)
- **Claude**: `sk-ant-...` (starts with sk-ant-)

## Development Configuration

### Vite Configuration

The app uses Vite with the following configuration:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
});
```

### TypeScript Configuration

Strict TypeScript settings for better code quality:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Tailwind Configuration

Custom theme with brand colors:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          // Custom brand color palette
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
```

## Browser Storage

The application uses localStorage for:

- AI provider settings (API keys, models)
- Chat conversations and history
- User preferences

### Storage Keys

- `guruji_provider` - Provider configuration
- `guruji_chats` - Chat data and personas

## Security Considerations

1. **Client-Side Only**: All API calls are made directly from the browser
2. **No Server Storage**: No sensitive data is stored on any server
3. **Local Storage**: API keys stored in browser localStorage only
4. **HTTPS Required**: Use HTTPS in production for secure API calls

## Production Deployment

### Build Process

```bash
npm run build
```

Generates optimized static files in `dist/` directory.

### Deployment Options

- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Self-Hosted**: Nginx, Apache

### Environment Setup for Production

1. Set up HTTPS (required for secure API calls)
2. Configure proper headers for security
3. Enable gzip compression
4. Set up proper caching headers

### Example Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Serve static files
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
