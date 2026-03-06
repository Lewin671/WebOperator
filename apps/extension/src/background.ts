import { createWebOperatorAgent, BrowserAdapter } from '@web-operator/core';
import { OpenAIProvider } from '@web-operator/llm';

class ChromeBrowserAdapter implements BrowserAdapter {
    private async sendMessageToActiveTab(message: any): Promise<any> {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length === 0 || !tabs[0].id) throw new Error("No active tab");
        return new Promise((resolve) => {
            chrome.tabs.sendMessage(tabs[0].id!, message, (response) => resolve(response));
        });
    }

    async readDOM(): Promise<string> {
        return this.sendMessageToActiveTab({ action: 'readDOM' });
    }
    async clickElement(selector: string): Promise<string> {
        return this.sendMessageToActiveTab({ action: 'clickElement', selector });
    }
    async inputText(selector: string, text: string): Promise<string> {
        return this.sendMessageToActiveTab({ action: 'inputText', selector, text });
    }
    async scrollPage(direction: 'up' | 'down'): Promise<string> {
        return this.sendMessageToActiveTab({ action: 'scrollPage', direction });
    }
    async evaluateScript(script: string): Promise<any> {
        return this.sendMessageToActiveTab({ action: 'evaluateScript', script });
    }
}

let agent: any = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startAgent') {
        if (!agent) {
            const llm = new OpenAIProvider({ apiKey: request.apiKey, model: 'gpt-4o' });
            const adapter = new ChromeBrowserAdapter();
            agent = createWebOperatorAgent(llm, adapter);
        }

        agent.run(request.instruction).then((result: string) => {
            sendResponse({ status: 'done', result });
        }).catch((error: Error) => {
            sendResponse({ status: 'error', error: error.message });
        });

        return true; // Indicates async response
    }
});
