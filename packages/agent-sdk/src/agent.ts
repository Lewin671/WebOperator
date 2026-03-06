import { Agent, AgentContext } from './types';

export class ReActAgent implements Agent {
    constructor(private context: AgentContext) { }

    async run(instruction: string, maxIterations = 10): Promise<string> {
        this.context.memory.addMessage({ role: 'user', content: instruction });

        for (let i = 0; i < maxIterations; i++) {
            const messages = this.context.memory.getMessages();
            const tools = this.context.tools.getTools();

            const response = await this.context.llm.chat(messages, tools);
            this.context.memory.addMessage(response);

            if (response.toolCalls && response.toolCalls.length > 0) {
                for (const toolCall of response.toolCalls) {
                    try {
                        const result = await this.context.tools.executeTool(toolCall.name, toolCall.arguments);
                        this.context.memory.addMessage({
                            role: 'tool',
                            content: typeof result === 'string' ? result : JSON.stringify(result),
                            toolCallId: toolCall.id
                        });
                    } catch (error: any) {
                        this.context.memory.addMessage({
                            role: 'tool',
                            content: `Error: ${error.message}`,
                            toolCallId: toolCall.id
                        });
                    }
                }
            } else {
                return response.content;
            }
        }

        throw new Error('Agent reached maximum iterations without completing the task.');
    }
}
