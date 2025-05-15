# Self-Morphing LLM Interface

A single-page web application that allows LLMs to modify their own interface based on user requests. This project creates a chat interface where users can interact with various LLM providers, and the LLM can dynamically change the page's appearance and functionality.

## Features

- **Chat Interface**: Clean, responsive design for conversing with LLMs
- **Multi-LLM Support**: Compatible with OpenAI, Claude, Gemini, Mistral, and local LMs via LM Studio
- **Self-Modification**: LLMs can modify the page DOM, CSS, and functionality
- **Secure Execution**: Sandboxed code execution for LLM-generated modifications
- **Local Storage**: Securely store API keys and settings in the browser

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Configure your preferred LLM provider and API key in the settings
4. Start chatting with the LLM!

## Page Modification

The LLM can modify the page by sending special commands in this format:

```
[MODIFY_PAGE]
```json
{
  "createElement": {
    "tagName": "div",
    "attributes": {
      "className": "custom-element",
      "style": {
        "color": "red",
        "fontSize": "20px"
      }
    },
    "textContent": "This element was created by the LLM",
    "parent": "#messagesContainer"
  }
}
```
[/MODIFY_PAGE]
```

## Supported LLM Providers

- **OpenAI**: GPT-4 and other models
- **Anthropic**: Claude models
- **Google**: Gemini models
- **Mistral**: Mistral Large and other models
- **LM Studio**: Local LLM server for open-source models

## Project Structure

- `index.html`: Main application HTML and UI
- `js/llm-api.js`: API client for various LLM providers
- `js/page-modifier.js`: Page modification functionality
- `CLAUDE.md`: Project documentation and development notes
- `tasks.md`: Task list and progress tracking

## Running Locally

Simply open `index.html` in a web browser. No server is required for basic functionality.

For local LLM support, you'll need to run LM Studio's local server and configure the URL in settings.

## Security Considerations

- API keys are stored in localStorage and never sent to the LLM
- Code execution is sandboxed to prevent malicious actions
- User input is validated and sanitized before processing

## License

MIT