/**
 * LLM API Integration Module
 * Handles communication with various LLM providers: OpenAI, Claude, Gemini, Mistral, and LM Studio
 */

class LLMApiClient {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('llmSettings') || '{}');
    }

    /**
     * Updates client settings
     * @param {Object} settings - The settings object
     */
    updateSettings(settings) {
        this.settings = settings;
        localStorage.setItem('llmSettings', JSON.stringify(settings));
    }

    /**
     * Checks if the client is properly configured
     * @returns {boolean} - True if configured, false otherwise
     */
    isConfigured() {
        // For LM Studio local server, we don't require an API key
        if (this.settings.provider === 'lmstudio') {
            return Boolean(this.settings.provider);
        }
        // For other providers, API key is required
        return Boolean(this.settings.provider && this.settings.apiKey);
    }

    /**
     * Gets the display name for the current provider
     * @returns {string} - The provider display name
     */
    getProviderName() {
        const providers = {
            'openai': 'OpenAI',
            'anthropic': 'Anthropic Claude',
            'gemini': 'Google Gemini',
            'mistral': 'Mistral',
            'lmstudio': 'LM Studio (Local)'
        };
        return providers[this.settings.provider] || this.settings.provider;
    }

    /**
     * Sends a message to the LLM provider
     * @param {string} message - The user's message
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from the LLM
     */
    async sendMessage(message, conversation = []) {
        if (!this.isConfigured()) {
            throw new Error('API client is not configured');
        }

        console.log('Sending message to provider:', this.settings.provider);
        
        // Add the user message to the conversation history
        conversation.push({ role: 'user', content: message });

        try {
            let response;
            switch (this.settings.provider) {
                case 'openai':
                    if (!this.settings.apiKey) {
                        throw new Error('OpenAI requires an API key');
                    }
                    console.log('Calling OpenAI API...');
                    response = await this.callOpenAI(conversation);
                    break;
                case 'anthropic':
                    if (!this.settings.apiKey) {
                        throw new Error('Anthropic Claude requires an API key');
                    }
                    console.log('Calling Anthropic API...');
                    response = await this.callAnthropic(conversation);
                    break;
                case 'gemini':
                    if (!this.settings.apiKey) {
                        throw new Error('Google Gemini requires an API key');
                    }
                    console.log('Calling Gemini API...');
                    response = await this.callGemini(conversation);
                    break;
                case 'mistral':
                    if (!this.settings.apiKey) {
                        throw new Error('Mistral requires an API key');
                    }
                    console.log('Calling Mistral API...');
                    response = await this.callMistral(conversation);
                    break;
                case 'lmstudio':
                    // LM Studio doesn't require an API key
                    console.log('Calling LM Studio API...');
                    response = await this.callLMStudio(conversation);
                    break;
                default:
                    throw new Error(`Provider ${this.settings.provider} not supported`);
            }

            // Add the assistant's response to the conversation history
            conversation.push({ role: 'assistant', content: response });
            return response;
        } catch (error) {
            console.error('Error calling LLM API:', error);
            throw error;
        }
    }

    /**
     * Calls the OpenAI API
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from OpenAI
     */
    async callOpenAI(conversation) {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: conversation,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Calls the Anthropic Claude API
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from Claude
     */
    async callAnthropic(conversation) {
        const apiUrl = 'https://api.anthropic.com/v1/messages';
        
        // Convert conversation to Claude format
        const formattedConversation = {
            messages: conversation.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }))
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.settings.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                messages: formattedConversation.messages,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    /**
     * Calls the Google Gemini API
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from Gemini
     */
    async callGemini(conversation) {
        const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
        
        // Convert conversation to Gemini format
        const geminiMessages = conversation.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));
        
        const response = await fetch(`${apiUrl}?key=${this.settings.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: geminiMessages,
                generationConfig: {
                    maxOutputTokens: 2000
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Calls the Mistral API
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from Mistral
     */
    async callMistral(conversation) {
        const apiUrl = 'https://api.mistral.ai/v1/chat/completions';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: conversation,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Mistral API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Calls the LM Studio local server API
     * @param {Array} conversation - The conversation history
     * @returns {Promise<string>} - The response from the local LLM
     */
    async callLMStudio(conversation) {
        // Ensure the URL ends with /v1/chat/completions
        let baseUrl = this.settings.localServerUrl || 'http://localhost:1234';
        
        // Remove trailing slash if present
        baseUrl = baseUrl.replace(/\/$/, '');
        
        // Ensure URL has the correct endpoint path
        if (!baseUrl.endsWith('/v1/chat/completions')) {
            if (!baseUrl.includes('/v1')) {
                baseUrl = `${baseUrl}/v1/chat/completions`;
            } else {
                baseUrl = `${baseUrl.split('/v1')[0]}/v1/chat/completions`;
            }
        }
        
        console.log('Calling LM Studio API at:', baseUrl);
        console.log('With conversation:', JSON.stringify(conversation));
        
        // LM Studio doesn't require an API key, just the server URL
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversation,
                model: "local-model", // Generic model name for LM Studio
                max_tokens: 2000,
                temperature: 0.7,
                stream: false,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: null
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LM Studio API Error Response:', errorText);
            
            // If we got a "Unexpected endpoint" error, try some common fallback URLs
            if (errorText.includes("Unexpected endpoint") && !this._triedFallbacks) {
                this._triedFallbacks = true;
                console.log("Trying fallback endpoints...");
                
                // Try some common fallback endpoints
                const fallbackUrls = [
                    `${this.settings.localServerUrl || 'http://localhost:1234'}/v1/completions`,
                    `${this.settings.localServerUrl || 'http://localhost:1234'}/api/chat`,
                    `${this.settings.localServerUrl || 'http://localhost:1234'}/api/generate`,
                    `${this.settings.localServerUrl || 'http://localhost:1234'}/api/v1/generate`
                ];
                
                for (const fallbackUrl of fallbackUrls) {
                    try {
                        console.log(`Trying fallback URL: ${fallbackUrl}`);
                        
                        const fallbackResponse = await fetch(fallbackUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                messages: conversation,
                                model: "local-model",
                                max_tokens: 2000,
                                temperature: 0.7,
                                stream: false
                            })
                        });
                        
                        if (fallbackResponse.ok) {
                            const data = await fallbackResponse.json();
                            console.log('Fallback response successful:', data);
                            
                            // Reset fallback flag
                            this._triedFallbacks = false;
                            
                            // Extract response from various formats
                            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                                return data.choices[0].message.content;
                            } else if (data.response) {
                                return data.response;
                            } else if (data.content) {
                                return data.content;
                            } else if (data.output) {
                                return data.output;
                            } else if (data.text) {
                                return data.text;
                            } else if (typeof data === 'string') {
                                return data;
                            }
                        }
                    } catch (fallbackError) {
                        console.error(`Fallback URL ${fallbackUrl} failed:`, fallbackError);
                    }
                }
                
                // Reset fallback flag
                this._triedFallbacks = false;
            }
            
            try {
                const error = JSON.parse(errorText);
                throw new Error(`LM Studio API error: ${error.error?.message || response.statusText}. Please check the server URL in settings and make sure LM Studio is running properly.`);
            } catch (e) {
                throw new Error(`LM Studio API error: ${response.status} ${response.statusText}. Please check the server URL in settings and make sure LM Studio is running properly.`);
            }
        }

        try {
            const data = await response.json();
            console.log('LM Studio API Response:', data);
            
            // Handle different possible response formats
            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                return data.choices[0].message.content;
            } else if (data.response) {
                return data.response;
            } else if (data.content) {
                return data.content;
            } else if (data.output) {
                return data.output;
            } else if (typeof data === 'string') {
                return data;
            } else {
                console.error('Unknown LM Studio response format:', data);
                return JSON.stringify(data);
            }
        } catch (error) {
            console.error('Error parsing LM Studio response:', error);
            throw new Error(`Failed to parse LM Studio response: ${error.message}`);
        }
    }
}

// Export the client
const llmClient = new LLMApiClient();