import { useState } from 'react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [instruction, setInstruction] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const startAgent = () => {
    if (!apiKey || !instruction) {
      alert("Please provide both API Key and Instruction");
      return;
    }
    setLoading(true);
    setResult("Agent is thinking and executing...");

    // @ts-ignore
    chrome.runtime.sendMessage({ action: 'startAgent', apiKey, instruction }, (response: any) => {
      setLoading(false);
      if (chrome.runtime.lastError) {
        setResult("Error communicating with Background Script: " + chrome.runtime.lastError.message);
      } else if (response.status === 'error') {
        setResult("Error: " + response.error);
      } else {
        setResult("Agent Result: \n" + response.result);
      }
    });
  };

  return (
    <div style={{ width: '400px', padding: '16px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>WebOperator API</h2>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="password"
          placeholder="OpenAI API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <textarea
          placeholder="What should the agent do on this page?"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={startAgent}
        disabled={loading}
        style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? "Agent Running..." : "Execute Agent"}
      </button>

      {result && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
          <strong>Output:</strong><br />
          {result}
        </div>
      )}
    </div>
  );
}

export default App;
