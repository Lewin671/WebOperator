import { Message } from '@web-operator/llm';
import { Memory } from './types';

export class SimpleMemory implements Memory {
    private messages: Message[] = [];

    constructor(systemPrompt?: string) {
        if (systemPrompt) {
            this.messages.push({ role: 'system', content: systemPrompt });
        }
    }

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    getMessages(): Message[] {
        return [...this.messages];
    }

    clear(): void {
        const systemPrompt = this.messages.find(m => m.role === 'system');
        this.messages = systemPrompt ? [systemPrompt] : [];
    }
}
