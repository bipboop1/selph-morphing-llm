# Self-Morphing LLM Interface - Usage Instructions

This document explains how to use the Self-Morphing LLM interface effectively.

## Getting Started

1. Open `index.html` in your web browser
2. Click the settings icon (⚙️) in the top right corner
3. Select your preferred LLM provider
4. Enter your API key
5. Click "Save Settings"

## Chatting with the LLM

Simply type your message in the input area and press Enter or click the "Send" button. The LLM will respond in the chat window.

## Requesting Page Modifications

You can ask the LLM to modify the page in various ways. Here are some examples:

### Changing the Interface Colors

```
Can you change the color scheme of this interface to a dark theme?
```

### Adding New Elements

```
Can you add a button that clears the chat history?
```

### Creating New UI Features

```
Can you add a dropdown menu that lets me switch between different conversation topics?
```

### Modifying Existing Elements

```
Can you make the font size larger for better readability?
```

## Modification Commands

Behind the scenes, the LLM will respond with special modification commands in this format:

```
[MODIFY_PAGE]
```json
{
  "modifyElement": {
    "selector": "body",
    "attributes": {
      "style": {
        "backgroundColor": "#2d3436",
        "color": "#f5f6fa"
      }
    }
  }
}
```
[/MODIFY_PAGE]
```

These commands tell the application to make specific changes to the page.

## Supported Modifications

The interface supports these types of modifications:

1. **createElement**: Add new DOM elements
2. **modifyElement**: Change existing elements
3. **deleteElement**: Remove elements
4. **addCSS**: Add or modify CSS styles
5. **executeScript**: Run JavaScript code

## Tips for Best Results

- Be specific in your requests
- Start with simple modifications
- If a modification doesn't work, try rephrasing your request
- Remember that the LLM can only modify the current page, not load external resources

## Security Notes

- Your API keys are stored in your browser's localStorage and are never sent to any server
- The LLM can only modify the current page, not access your browser history or other tabs
- Code execution is sandboxed to prevent potential security issues