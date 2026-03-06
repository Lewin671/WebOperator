import { LLMProvider, Message, Tool } from '../types';

export interface OpenAIConfig {
    apiKey: string;
    model?: string;
    baseUrl?: string;
}

export class OpenAIProvider implements LLMProvider {
    private apiKey: string;
    private model: string;
    private baseUrl: string;

    constructor(config: OpenAIConfig) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'gpt-4o';
        this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    }

    async chat(messages: Message[], tools?: Tool[]): Promise<Message> {
        const formattedMessages = messages.map(msg => {
            const formatted: any = {
                role: msg.role,
                content: msg.content,
            };
            if (msg.toolCalls) {
                formatted.tool_calls = msg.toolCalls.map(tc => ({
                    id: tc.id,
                    type: 'function',
                    function: { name: tc.name, arguments: JSON.stringify(tc.arguments) }
                }));
            }
            if (msg.toolCallId) {
                formatted.tool_call_id = msg.toolCallId;
            }
            return formatted;
        });

        const body: any = {
            model: this.model,
            messages: formattedMessages,
        };

        if (tools && tools.length > 0) {
            body.tools = tools.map(t => ({
                type: 'function',
                function: {
                    name: t.name,
                    description: t.description,
                    parameters: t.parameters
                }
            }));
        }

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const choice = data.choices[0].message;

        const resultMsg: Message = {
            role: choice.role || 'assistant',
            content: choice.content || '',
        };

        if (choice.tool_calls) {
            resultMsg.toolCalls = choice.tool_calls.map((tc: any) => ({
                id: tc.id,
                name: tc.function.name,
                arguments: JSON.parse(tc.function.arguments)
            }));
        }

        return resultMsg;
    }
}
