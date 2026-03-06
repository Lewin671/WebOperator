chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'readDOM') {
        // Simple text extraction for demo purposes
        sendResponse(document.body.innerText.substring(0, 1500));
    } else if (request.action === 'clickElement') {
        const el = document.querySelector(request.selector) as HTMLElement;
        if (el) {
            el.click();
            sendResponse("Clicked element successfully.");
        }
        else { sendResponse(`Element not found: ${request.selector}`); }
    } else if (request.action === 'inputText') {
        const el = document.querySelector(request.selector) as HTMLInputElement | HTMLTextAreaElement;
        if (el) {
            el.value = request.text;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            sendResponse("Input placed successfully.");
        }
        else { sendResponse(`Input element not found: ${request.selector}`); }
    } else if (request.action === 'scrollPage') {
        window.scrollBy({ top: request.direction === 'down' ? window.innerHeight : -window.innerHeight, behavior: 'smooth' });
        sendResponse(`Scrolled ${request.direction}`);
    } else if (request.action === 'evaluateScript') {
        try {
            // Use Function to avoid eval warnings if possible, or eval for quick testing
            const res = new Function(request.script)();
            sendResponse(String(res));
        } catch (e: any) {
            sendResponse(`Error evaluating script: ${e.message}`);
        }
    }
    return true;
});
