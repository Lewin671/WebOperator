# WebOperator

WebOperator is an AI Agent Chrome Browser Extension designed to interact with and operate web pages autonomously. It leverages Large Language Models (LLMs) to understand user instructions, read the current webpage, and perform actions such as clicking, typing, and scrolling.

## Architecture

This project is built as a **pnpm monorepo** with a clean, layered architecture to ensure separation of concerns and extensibility:

1. **`packages/llm` (LLM Abstraction)**: Defines the core interfaces (`Message`, `ToolCall`, `Tool`) and provides a base abstraction for interacting with different LLM providers (e.g., OpenAI, Anthropic). It handles the parsing of tool calls and message formatting.
2. **`packages/agent-sdk` (Agent SDK)**: The brain of the agent. It implements the reasoning loop (currently utilizing a ReAct pattern), manages long-term or short-term memory (Context), and orchestrates the execution of tools via the `ToolManager`.
3. **`packages/web-operator` (WebOperator Core)**: Connects the theoretical Agent SDK to concrete implementations. It defines browser-specific tools (`read_dom`, `click_element`, `input_text`, `scroll_page`) and provides a factory to instantiate an Agent capable of browsing.
4. **`apps/extension` (UI / Chrome Extension)**: The actual Chrome extension implementation. Built with React and Vite, it contains the visual popup interface, a background service worker to run the Agent persistently, and content scripts injected into active tabs to execute DOM manipulations safely.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)

## Installation & Build

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd WebOperator
   pnpm install
   ```

2. **Build the Monorepo**
   Compile all packages and the Chrome extension app:
   ```bash
   pnpm run build
   ```
   *This will generate a `dist` folder inside `apps/extension` containing the compiled extension ready to be loaded into Chrome.*

## Loading the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** by toggling the switch in the top right corner.
3. Click the **Load unpacked** button.
4. Select the `apps/extension/dist` directory from this repository.

## Usage

1. Pin the WebOperator extension to your toolbar for easy access.
2. Click the extension icon to open the popup interface.
3. Provide your **OpenAI API Key** in the designated input field.
4. Enter an instruction (e.g., "Summarize the main content of this page" or "Click the login button").
5. The Agent will analyze the page, reason about the necessary steps, and execute UI interactions autonomously!

## Development

To develop and test packages iteratively, you can run TypeScript in watch mode within specific packages.

For the extension UI, you can run:
```bash
cd apps/extension
npm run dev
```

## Future Roadmap

- Support for additional LLM providers (Anthropic Claude, Google Gemini, Local Models).
- Enhanced DOM parsing and robust semantic element selection.
- Implementation of more complex reasoning strategies (Plan-and-Solve).
- Richer UI to visualize the Agent's thought processes and tool execution steps in real-time.
