import React, { useState } from 'react';
import './App.css';
import vocabularyData from './data/vocabulary.json';

function App() {
  const [gameState, setGameState] = useState('TITLE');
  const [selectedModule, setSelectedModule] = useState(null);
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [inputVal, setInputVal] = useState('');

  // Extract unique modules dynamically from data source
  const modules = [...new Set(vocabularyData.map(item => item.module))];

  const launchModule = (moduleName) => {
    const filtered = vocabularyData.filter(item => item.module === moduleName);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setSelectedModule(moduleName);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setFeedback(null);
    setInputVal('');
    setGameState('PLAYING');
  };

  const processAnswer = (isCorrect, correctDisplay) => {
    if (isCorrect) {
      const bonus = Math.floor(streak / 3) + 1;
      setScore(s => s + (10 * bonus));
      setStreak(s => s + 1);
      setFeedback({ success: true, text: CORRECT! + pts });
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setFeedback({ success: false, text: MISS! Answer:  });
      if (newLives <= 0) {
        setTimeout(() => setGameState('GAMEOVER'), 1000);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setInputVal('');
      setCurrentIndex(prev => (prev + 1) % deck.length);
    }, 1100);
  };

  const handleGenderChoice = (article) => {
    const current = deck[currentIndex];
    processAnswer(article === current.gender, ${current.gender} );
  };

  const handleTranslationSubmit = (e) => {
    e.preventDefault();
    const current = deck[currentIndex];
    const match = inputVal.trim().toLowerCase() === current.english.toLowerCase();
    processAnswer(match, current.english);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      {/* MODULE CURRICULUM SELECTION */}
      {gameState === 'TITLE' && (
        <div style={{ textAlign: 'center', maxWidth: '550px', background: '#1e293b', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#38bdf8' }}>DEUTSCH MÜNDLICH</h1>
          <p style={{ color: '#94a3b8', marginBottom: '25px' }}>Practical Communication Curriculum</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Select Communication Module:</p>
            {modules.map((mod, idx) => (
              <button key={idx} onClick={() => launchModule(mod)} style={{ padding: '14px 18px', fontSize: '16px', fontWeight: '600', backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{mod}</span>
                <span style={{ fontSize: '12px', color: '#38bdf8' }}>START ?</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE GAMEPLAY */}
      {gameState === 'PLAYING' && deck.length > 0 && (
        <div style={{ width: '100%', maxWidth: '600px', background: '#1e293b', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '14px', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
            <span style={{ color: '#38bdf8', fontWeight: '600' }}>{selectedModule}</span>
            <button onClick={() => setGameState('TITLE')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>? Exit</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '15px', color: '#94a3b8' }}>
            <span>SCORE: <strong style={{ color: '#38bdf8' }}>{score}</strong></span>
            <span>STREAK: <strong style={{ color: '#f59e0b' }}>{streak}x</strong></span>
            <span>LIVES: <strong style={{ color: '#ef4444' }}>{'??'.repeat(lives)}</strong></span>
          </div>

          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '40px', fontWeight: '800', marginBottom: '10px', color: '#f8fafc' }}>
              {deck[currentIndex].german}
            </div>
            <div style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '30px' }}>
              Translate / Identify Target
            </div>

            {feedback ? (
              <div style={{ padding: '16px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', backgroundColor: feedback.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: feedback.success ? '#34d399' : '#f87171', border: \1px solid \\ }}>
                {feedback.text}
              </div>
            ) : deck[currentIndex].gender === 'phrase' ? (
              <form onSubmit={handleTranslationSubmit}>
                <input 
                  type="text" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  placeholder="Type English meaning..." 
                  autoFocus
                  style={{ width: '80%', padding: '14px', fontSize: '16px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', outline: 'none', textAlign: 'center', marginBottom: '15px' }}
                />
                <div>
                  <button type="submit" style={{ padding: '12px 30px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Submit</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button onClick={() => handleGenderChoice('der')} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>der</button>
                <button onClick={() => handleGenderChoice('die')} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#db2777', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>die</button>
                <button onClick={() => handleGenderChoice('das')} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>das</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === 'GAMEOVER' && (
        <div style={{ textAlign: 'center', maxWidth: '400px', background: '#1e293b', padding: '40px', borderRadius: '16px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '32px', color: '#ef4444', marginBottom: '10px' }}>SESSION COMPLETE</h2>
          <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '20px' }}>Final Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
          <button onClick={() => setGameState('TITLE')} style={{ padding: '12px 25px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return to Curriculum</button>
        </div>
      )}
    </div>
  );
}

export default App;
