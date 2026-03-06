import { LLMProvider } from '@web-operator/llm';
import { ReActAgent, SimpleMemory, SimpleToolManager } from '@web-operator/agent-sdk';
import { BrowserAdapter } from './types';
import { createBrowserTools } from './tools';

const WEB_OPERATOR_SYSTEM_PROMPT = `You are WebOperator, an AI browser assistant.
You can read the page DOM, click elements, input text, and navigate using the provided tools.
Analyze the user's request, examine the page content, and form a plan before executing tools based on the ReAct framework.`;

export const createWebOperatorAgent = (llm: LLMProvider, adapter: BrowserAdapter) => {
    const memory = new SimpleMemory(WEB_OPERATOR_SYSTEM_PROMPT);
    const toolManager = new SimpleToolManager();

    const browserTools = createBrowserTools(adapter);
    for (const tool of browserTools) {
        toolManager.registerTool(tool);
    }

    return new ReActAgent({
        memory,
        tools: toolManager,
        llm
    });
}
