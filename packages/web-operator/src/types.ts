export interface BrowserAdapter {
    readDOM(): Promise<string>;
    clickElement(selector: string): Promise<string>;
    inputText(selector: string, text: string): Promise<string>;
    scrollPage(direction: 'up' | 'down'): Promise<string>;
    evaluateScript(script: string): Promise<any>;
}
