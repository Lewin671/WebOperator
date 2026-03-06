import { Message, Tool, LLMProvider } from '@web-operator/llm';

export interface AgentContext {
    memory: Memory;
    tools: ToolManager;
    llm: LLMProvider;
}

export interface Memory {
    addMessage(message: Message): void;
    getMessages(): Message[];
    clear(): void;
}

export interface ToolManager {
    registerTool(tool: Tool): void;
    getTools(): Tool[];
    executeTool(name: string, args: Record<string, any>): Promise<any>;
}

export interface Agent {
    run(instruction: string, maxIterations?: number): Promise<string>;
}
