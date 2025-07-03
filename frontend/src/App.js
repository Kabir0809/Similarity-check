import React, { useState } from "react";
import "./App.css";

function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result, setResult] = useState(null);

  // Function to preprocess text and calculate similarity
  const handleCheck = async () => {
    if (text1.split(" ").length < 5 || text2.split(" ").length < 5) {
      alert("Each text must have at least 10 words.");
      return;
    }

    const res = await fetch("http://localhost:5000/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text1, text2 }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="App">
      <h2>Text Similarity Checker</h2>
      <textarea
        value={text1}
        onChange={(e) => setText1(e.target.value)}
        placeholder="Enter first text"
      />
      <textarea
        value={text2}
        onChange={(e) => setText2(e.target.value)}
        placeholder="Enter second text"
      />
      <button onClick={handleCheck}>Check Similarity</button>

      {result && (
        <div className="results">
          <h3>Results</h3>
          <p><strong>Word Count (Text 1):</strong> {result.wordCount1}</p>
          <p><strong>Word Count (Text 2):</strong> {result.wordCount2}</p>
          <p><strong>Shared Words:</strong> {result.sharedWords.join(", ")}</p>
          <p><strong>Similarity Score:</strong> {result.similarityScore}</p>
        </div>
      )}
    </div>
  );
}

export default App;
