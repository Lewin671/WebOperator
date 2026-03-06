import { Tool } from '@web-operator/llm';
import { ToolManager } from './types';

export class SimpleToolManager implements ToolManager {
    private tools: Map<string, Tool> = new Map();

    registerTool(tool: Tool): void {
        this.tools.set(tool.name, tool);
    }

    getTools(): Tool[] {
        return Array.from(this.tools.values());
    }

    async executeTool(name: string, args: Record<string, any>): Promise<any> {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool ${name} not found`);
        }
        return tool.execute(args);
    }
}
