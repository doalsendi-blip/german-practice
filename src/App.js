import React, { useState } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>German Practice App</h1>
      <p>Custom game logic is now active.</p>
      <h2>Score: {score}</h2>
      <button onClick={() => setScore(score + 1)}>Correct Answer</button>
    </div>
  );
}

export default App;
