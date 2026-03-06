import { Tool } from '@web-operator/llm';
import { BrowserAdapter } from './types';

export const createBrowserTools = (adapter: BrowserAdapter): Tool[] => {
    return [
        {
            name: 'read_dom',
            description: 'Reads the simplified DOM of the current active page, showing interactive elements and text.',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            execute: async () => {
                return await adapter.readDOM();
            }
        },
        {
            name: 'click_element',
            description: 'Clicks an element on the page based on a CSS selector.',
            parameters: {
                type: 'object',
                properties: {
                    selector: { type: 'string', description: 'The CSS selector of the element to click.' }
                },
                required: ['selector']
            },
            execute: async (args: any) => {
                return await adapter.clickElement(args.selector);
            }
        },
        {
            name: 'input_text',
            description: 'Inputs text into a specific input or textarea element on the page.',
            parameters: {
                type: 'object',
                properties: {
                    selector: { type: 'string', description: 'The CSS selector of the input element.' },
                    text: { type: 'string', description: 'The text to type into the element.' }
                },
                required: ['selector', 'text']
            },
            execute: async (args: any) => {
                return await adapter.inputText(args.selector, args.text);
            }
        },
        {
            name: 'scroll_page',
            description: 'Scrolls the page up or down.',
            parameters: {
                type: 'object',
                properties: {
                    direction: { type: 'string', enum: ['up', 'down'], description: 'The direction to scroll.' }
                },
                required: ['direction']
            },
            execute: async (args: any) => {
                return await adapter.scrollPage(args.direction);
            }
        }
    ];
}
