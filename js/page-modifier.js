/**
 * Page Modifier Module
 * Provides functionality for an LLM to modify the web page based on user requests
 */

class PageModifier {
    constructor() {
        // Sandbox for evaluating code safely
        this.sandbox = null;
        this.initializeSandbox();
    }

    /**
     * Initializes the sandbox iframe for code execution
     */
    initializeSandbox() {
        // Create a sandboxed iframe
        const frame = document.createElement('iframe');
        frame.style.display = 'none';
        document.body.appendChild(frame);
        
        // Get the window and document objects from the iframe
        this.sandbox = {
            window: frame.contentWindow,
            document: frame.contentWindow.document
        };
        
        // Initialize sandbox document
        this.sandbox.document.open();
        this.sandbox.document.write('<!DOCTYPE html><html><head></head><body></body></html>');
        this.sandbox.document.close();
    }

    /**
     * Safely evaluates JavaScript code
     * @param {string} code - The JavaScript code to evaluate
     * @returns {any} - The result of the evaluation
     */
    safeEval(code) {
        try {
            // Create a function from the code and execute it in the sandbox
            const fn = new this.sandbox.window.Function('document', 'window', code);
            return fn.call(null, this.sandbox.document, this.sandbox.window);
        } catch (error) {
            console.error('Error executing code:', error);
            throw new Error(`Failed to execute code: ${error.message}`);
        }
    }

    /**
     * Modifies the DOM based on instructions
     * @param {Object} instructions - The modification instructions
     */
    modifyDOM(instructions) {
        try {
            // Validate instructions
            if (!instructions || typeof instructions !== 'object') {
                throw new Error('Invalid modification instructions');
            }

            // Handle different types of modifications
            if (instructions.createElement) {
                this.createElement(instructions.createElement);
            }

            if (instructions.modifyElement) {
                this.modifyElement(instructions.modifyElement);
            }

            if (instructions.deleteElement) {
                this.deleteElement(instructions.deleteElement);
            }

            if (instructions.addCSS) {
                this.addCSS(instructions.addCSS);
            }

            if (instructions.executeScript) {
                this.executeScript(instructions.executeScript);
            }

            return true;
        } catch (error) {
            console.error('Error modifying DOM:', error);
            throw error;
        }
    }

    /**
     * Creates a new DOM element
     * @param {Object} params - Parameters for the new element
     */
    createElement(params) {
        const { tagName, attributes, textContent, innerHTML, parent, position } = params;
        
        if (!tagName) {
            throw new Error('tagName is required for createElement');
        }

        // Create the element
        const element = document.createElement(tagName);
        
        // Set attributes
        if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        element.style[styleKey] = styleValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });
        }
        
        // Set content
        if (textContent !== undefined) {
            element.textContent = textContent;
        } else if (innerHTML !== undefined) {
            element.innerHTML = innerHTML;
        }
        
        // Add to parent
        const parentElement = parent ? document.querySelector(parent) : document.body;
        
        if (!parentElement) {
            throw new Error(`Parent element not found: ${parent}`);
        }
        
        if (position === 'prepend') {
            parentElement.prepend(element);
        } else if (position === 'before') {
            parentElement.parentNode.insertBefore(element, parentElement);
        } else if (position === 'after') {
            parentElement.parentNode.insertBefore(element, parentElement.nextSibling);
        } else {
            parentElement.appendChild(element);
        }
        
        return element;
    }

    /**
     * Modifies an existing DOM element
     * @param {Object} params - Parameters for the modification
     */
    modifyElement(params) {
        const { selector, attributes, textContent, innerHTML } = params;
        
        if (!selector) {
            throw new Error('selector is required for modifyElement');
        }
        
        const element = document.querySelector(selector);
        
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }
        
        // Update attributes
        if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        element.style[styleKey] = styleValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });
        }
        
        // Update content
        if (textContent !== undefined) {
            element.textContent = textContent;
        } else if (innerHTML !== undefined) {
            element.innerHTML = innerHTML;
        }
        
        return element;
    }

    /**
     * Deletes a DOM element
     * @param {Object} params - Parameters for the deletion
     */
    deleteElement(params) {
        const { selector } = params;
        
        if (!selector) {
            throw new Error('selector is required for deleteElement');
        }
        
        const element = document.querySelector(selector);
        
        if (!element) {
            throw new Error(`Element not found: ${selector}`);
        }
        
        element.parentNode.removeChild(element);
    }

    /**
     * Adds CSS to the page
     * @param {Object} params - Parameters for the CSS addition
     */
    addCSS(params) {
        const { css, selector } = params;
        
        if (!css) {
            throw new Error('css is required for addCSS');
        }
        
        // If a selector is provided, create a scoped style
        if (selector) {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                throw new Error(`No elements found for selector: ${selector}`);
            }
            
            // Apply the styles to each matching element
            elements.forEach(element => {
                const styleMap = this.parseCSS(css);
                Object.entries(styleMap).forEach(([property, value]) => {
                    element.style[property] = value;
                });
            });
        } else {
            // Create a global style element
            const styleElement = document.createElement('style');
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        }
    }

    /**
     * Parses CSS string into a style object
     * @param {string} css - The CSS string to parse
     * @returns {Object} - The parsed style object
     */
    parseCSS(css) {
        const styleMap = {};
        
        // Remove comments and newlines
        css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/[\r\n]/g, '');
        
        // Split into declarations
        const declarations = css.split(';');
        
        // Process each declaration
        declarations.forEach(declaration => {
            const parts = declaration.split(':');
            if (parts.length === 2) {
                const property = parts[0].trim();
                const value = parts[1].trim();
                
                // Convert kebab-case to camelCase
                const camelProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
                
                styleMap[camelProperty] = value;
            }
        });
        
        return styleMap;
    }

    /**
     * Executes JavaScript on the page
     * @param {Object} params - Parameters for the script execution
     */
    executeScript(params) {
        const { code, async } = params;
        
        if (!code) {
            throw new Error('code is required for executeScript');
        }
        
        if (async) {
            // Create script element for async execution
            const scriptElement = document.createElement('script');
            scriptElement.textContent = code;
            document.head.appendChild(scriptElement);
        } else {
            // Execute synchronously using the sandbox
            return this.safeEval(code);
        }
    }

    /**
     * Processes commands from the LLM to modify the page
     * @param {string} commandText - The command text from the LLM
     * @returns {Object} - Result of the command execution
     */
    processCommands(commandText) {
        try {
            // Extract code blocks from the text
            const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/g;
            const codeBlocks = [];
            let match;
            
            while ((match = codeBlockRegex.exec(commandText)) !== null) {
                codeBlocks.push(match[1].trim());
            }
            
            if (codeBlocks.length === 0) {
                throw new Error('No valid code blocks found in command');
            }
            
            // Parse and execute each code block
            const results = codeBlocks.map(codeBlock => {
                try {
                    const instructions = JSON.parse(codeBlock);
                    return this.modifyDOM(instructions);
                } catch (error) {
                    console.error('Error processing code block:', error);
                    return { error: error.message, codeBlock };
                }
            });
            
            return { success: true, results };
        } catch (error) {
            console.error('Error processing commands:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export the modifier
const pageModifier = new PageModifier();