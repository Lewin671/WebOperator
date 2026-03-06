export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface Message {
    role: Role;
    content: string;
    toolCalls?: ToolCall[];
    toolCallId?: string; // used when role is 'tool'
}

export interface ToolCall {
    id: string;
    name: string;
    arguments: Record<string, any>;
}

export interface ToolParameter {
    type: string;
    description?: string;
    enum?: string[];
    properties?: Record<string, ToolParameter>;
    required?: string[];
    items?: ToolParameter;
}

export interface Tool {
    name: string;
    description: string;
    parameters: ToolParameter;
    execute: (args: Record<string, any>) => Promise<any> | any;
}

export interface LLMProvider {
    chat(messages: Message[], tools?: Tool[]): Promise<Message>;
}
