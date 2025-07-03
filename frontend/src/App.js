import React, { useState } from "react";
import "./App.css";

function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text1, text2 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Text Similarity Checker</h1>
      <div className="input-container">
        <textarea
          placeholder="Enter first text..."
          value={text1}
          onChange={(e) => setText1(e.target.value)}
        />
        <textarea
          placeholder="Enter second text..."
          value={text2}
          onChange={(e) => setText2(e.target.value)}
        />
      </div>

      <div className="button-container">
        <button onClick={handleCheck}>Check Similarity</button>
      </div>

      {error && <div className="error">⚠️ {error}</div>}

      {result && (
        <div className="result">
          <p>📝 <strong>Text 1 Words:</strong> {result.wordCount1}</p>
          <p>📝 <strong>Text 2 Words:</strong> {result.wordCount2}</p>
          <p>🔁 <strong>Shared Words:</strong> {result.sharedWordsCount}</p>
          <p>📊 <strong>Similarity Score:</strong> {result.similarityScore}%</p>
          <p>📚 <strong>Shared Words:</strong> {result.sharedWords.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
