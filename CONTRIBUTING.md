# Contributing to Guruji

Thank you for your interest in contributing to Guruji! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/Persona.git
   cd Persona
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow the existing component structure
- Add proper error boundaries where needed

### State Management
- Use Redux Toolkit for global state
- Keep local state in components when possible
- Use proper action creators and selectors
- Maintain immutable state updates

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test on multiple screen sizes

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test with all 4 AI providers (OpenAI, Gemini, Groq, Claude)
- [ ] Verify onboarding flow works
- [ ] Test settings modal functionality
- [ ] Ensure chat persistence works
- [ ] Check markdown rendering
- [ ] Test error handling scenarios
- [ ] Verify responsive design

### Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Bug Reports

When reporting bugs, include:
- Browser version and OS
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console error messages
- AI provider being used

## 💡 Feature Requests

For new features:
- Check existing issues first
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Discuss potential breaking changes

## 📝 Pull Request Process

### Before Submitting
1. Ensure your code follows the style guidelines
2. Test your changes thoroughly
3. Update documentation if needed
4. Add JSDoc comments for new functions
5. Verify the build passes: `npm run build`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested manually
- [ ] Tested on multiple browsers
- [ ] Tested with multiple AI providers

## Screenshots (if applicable)

## Additional Notes
```

### Review Process
1. Code review by maintainers
2. Automated checks must pass
3. Manual testing verification
4. Documentation review
5. Final approval and merge

## 🏗️ Architecture Guidelines

### Adding New AI Providers
1. Create service file in `src/services/ai/`
2. Implement required functions:
   - `create[Provider]ChatCompletion`
   - `validate[Provider]Key`
   - `list[Provider]Models`
3. Add provider to `ProviderName` type
4. Update UI components to include new provider
5. Add error handling and validation
6. Update documentation

### Adding New Components
1. Create component in appropriate directory
2. Use TypeScript with proper interfaces
3. Add JSDoc documentation
4. Follow existing patterns
5. Export from index file if needed

### State Management Changes
1. Update relevant slice in `src/store/slices/`
2. Add proper TypeScript types
3. Use immer-friendly patterns
4. Add selectors if needed
5. Update hooks if necessary

## 🔒 Security Considerations

- Never commit API keys or secrets
- Validate all user inputs
- Use proper TypeScript types for safety
- Handle errors gracefully
- Follow secure coding practices

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### AI Provider APIs
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Groq API](https://console.groq.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)

## 🤔 Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search GitHub issues
3. Create a discussion thread
4. Reach out to maintainers

Thank you for contributing to Guruji! 🙏
