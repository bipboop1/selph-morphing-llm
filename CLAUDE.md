# Self-Morphing LLM Interface

This project creates a self-modifying web interface where an LLM can modify its own appearance and functionality based on user requests. The interface consists of a single HTML page where users can chat with the LLM and request changes that are dynamically rendered.

## Project Requirements

- **Single Page Interface**: All functionality contained in one HTML page
- **Self-Modifying**: LLM can modify the page's DOM, styles, and functionality
- **Multi-API Support**: Compatible with multiple LLM providers
  - OpenAI (GPT models)
  - Anthropic (Claude models)
  - Google (Gemini models)
  - Mistral
  - Local LLMs via LM Studio API Server

## Technical Architecture

### Components

1. **Chat Interface**
   - Message history display
   - User input area
   - Status indicators

2. **API Integrations**
   - API key management
   - Provider selection
   - Request/response handling

3. **Self-Modification System**
   - JS evaluation capability
   - DOM manipulation functions
   - CSS modification functions
   - Script injection

4. **Configuration**
   - API settings
   - UI preferences
   - System messages

## Implementation Guidelines

- Use vanilla JavaScript for core functionality
- Minimize external dependencies
- Ensure code execution sandboxing for security
- Implement responsive design for all viewports
- Store user API keys locally and securely

## Project Tasks

1. ✅ Design a chat interface for user-LLM interaction on a single HTML page
2. ⬜ Implement API integration for OpenAI, Claude, Gemini, Mistral, and LM Studio
3. ⬜ Enable LLM to send code or commands to modify the page dynamically
4. ⬜ Test all functionalities across supported APIs and local LLM server

## Development Commands

```bash
# Start a local server
python -m http.server 8000

# Run tests
# TBD

# Deployment
# TBD
```

## Security Considerations

- Never send API keys to the LLM itself
- Validate and sanitize code before execution
- Apply Content Security Policy (CSP) appropriately
- Restrict code execution to necessary functions only
- Prevent access to sensitive browser APIs

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Mistral API Documentation](https://docs.mistral.ai/api/)
- [LM Studio Documentation](https://lmstudio.ai/docs/local-server)