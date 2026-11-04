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
      const pointsEarned = 10 * bonus;
      setScore(s => s + pointsEarned);
      setStreak(s => s + 1);
      setFeedback({ success: true, text: `CORRECT (+${pointsEarned} pts)` });
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setFeedback({ success: false, text: `MISS: ${correctDisplay}` });
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
    processAnswer(article === current.gender, `${current.gender} ${current.german}`);
  };

  const handleTranslationSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const current = deck[currentIndex];
    const match = inputVal.trim().toLowerCase() === current.english.toLowerCase();
    processAnswer(match, current.english);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      
      {/* TITLE VIEW */}
      {gameState === 'TITLE' && (
        <div style={{ width: '100%', maxWidth: '520px', background: '#1e293b', padding: '40px 32px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', letterSpacing: '-0.02em', color: '#38bdf8', textAlign: 'center', fontWeight: '800' }}>DEUTSCH MUNDLICH</h1>
          <p style={{ margin: '0 0 28px 0', color: '#94a3b8', fontSize: '15px', textAlign: 'center' }}>Practical Communication Curriculum</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Available Modules</span>
            {modules.map((mod, idx) => (
              <button key={idx} onClick={() => launchModule(mod)} style={{ padding: '14px 18px', fontSize: '15px', fontWeight: '600', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s ease' }}>
                <span>{mod}</span>
                <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '700' }}>START &rarr;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAMEPLAY VIEW */}
      {gameState === 'PLAYING' && deck.length > 0 && (
        <div style={{ width: '100%', maxWidth: '560px', background: '#1e293b', padding: '28px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          
          {/* HEADER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #334155', marginBottom: '18px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8' }}>{selectedModule}</span>
            <button onClick={() => setGameState('TITLE')} style={{ background: '#334155', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Exit</button>
          </div>

          {/* STATUS HUD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '28px' }}>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em' }}>SCORE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>{score}</div>
            </div>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em' }}>STREAK</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>{streak}x</div>
            </div>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em' }}>LIVES</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444', letterSpacing: '3px' }}>
                {Array.from({ length: 3 }).map((_, i) => (i < lives ? '●' : '○')).join(' ')}
              </div>
            </div>
          </div>

          {/* MAIN PROMPT */}
          <div style={{ textAlign: 'center', padding: '16px 0 24px 0' }}>
            <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '8px' }}>
              {deck[currentIndex].german}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
              Translate to English
            </div>

            {feedback ? (
              <div style={{ padding: '14px 20px', borderRadius: '8px', fontSize: '16px', fontWeight: '700', backgroundColor: feedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: feedback.success ? '#34d399' : '#f87171', border: `1px solid ${feedback.success ? '#059669' : '#dc2626'}` }}>
                {feedback.text}
              </div>
            ) : deck[currentIndex].gender === 'phrase' ? (
              <form onSubmit={handleTranslationSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <input 
                  type="text" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  placeholder="Type English meaning..." 
                  autoFocus
                  style={{ width: '100%', maxWidth: '380px', padding: '14px 16px', fontSize: '16px', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ padding: '12px 36px', fontSize: '15px', fontWeight: '700', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Submit</button>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => handleGenderChoice('der')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>der</button>
                <button onClick={() => handleGenderChoice('die')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#db2777', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>die</button>
                <button onClick={() => handleGenderChoice('das')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>das</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME OVER VIEW */}
      {gameState === 'GAMEOVER' && (
        <div style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '36px 28px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', color: '#ef4444', margin: '0 0 10px 0', fontWeight: '800' }}>SESSION COMPLETE</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 24px 0' }}>Final Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
          <button onClick={() => setGameState('TITLE')} style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return to Curriculum</button>
        </div>
      )}
    </div>
  );
}

export default App;