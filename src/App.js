import React, { useState } from 'react';
import './App.css';
import rawData from './data/vocabulary.json';

function App() {
  const [view, setView] = useState('MENU');
  const [activeModule, setActiveModule] = useState('ALL');
  const [activeMode, setActiveMode] = useState('gender');
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [inputVal, setInputVal] = useState('');

  const modules = ['ALL', ...new Set(rawData.map(d => d.module).filter(Boolean))];

  const startGame = (mode, selectedMod) => {
    let pool = rawData;
    if (selectedMod !== 'ALL') {
      pool = pool.filter(d => d.module === selectedMod);
    }

    if (mode === 'gender') {
      pool = pool.filter(d => d.type === 'noun' && d.gender);
    } else if (mode === 'translation') {
      pool = pool.filter(d => d.type === 'phrase' || d.type === 'verb' || d.english);
    }

    if (pool.length === 0) {
      alert('No compatible items found for this mode in the selected module.');
      return;
    }

    setDeck([...pool].sort(() => Math.random() - 0.5));
    setActiveMode(mode);
    setActiveModule(selectedMod);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setFeedback(null);
    setInputVal('');
    setView('GAME');
  };

  const handleEvaluation = (isCorrect, answerLabel) => {
    if (isCorrect) {
      const bonus = Math.floor(streak / 3) + 1;
      const pts = 10 * bonus;
      setScore(s => s + pts);
      setStreak(s => s + 1);
      setFeedback({ ok: true, msg: `CORRECT (+${pts} pts)` });
    } else {
      const remainingLives = lives - 1;
      setLives(remainingLives);
      setStreak(0);
      setFeedback({ ok: false, msg: `INCORRECT: ${answerLabel}` });
      if (remainingLives <= 0) {
        setTimeout(() => setView('RESULT'), 1100);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setInputVal('');
      setIdx(prev => (prev + 1) % deck.length);
    }, 1100);
  };

  const submitGender = (chosenGender) => {
    const item = deck[idx];
    handleEvaluation(chosenGender === item.gender, `${item.gender} ${item.german} (${item.english})`);
  };

  const submitTranslation = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const item = deck[idx];
    const cleanInput = inputVal.trim().toLowerCase();
    const cleanTarget = item.english.toLowerCase();
    handleEvaluation(cleanInput === cleanTarget, item.english);
  };

  const currentItem = deck[idx];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      
      {view === 'MENU' && (
        <div style={{ width: '100%', maxWidth: '540px', background: '#1e293b', padding: '36px 32px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', color: '#38bdf8', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>DEUTSCH MÜNDLICH</h1>
          <p style={{ margin: '0 0 24px 0', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>Madrasa-Inspired Modular Communicative System</p>
          
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Select Curriculum Module</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {modules.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(m)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: activeModule === m ? '#0284c7' : '#0f172a',
                    color: '#f8fafc',
                    border: '1px solid',
                    borderColor: activeModule === m ? '#38bdf8' : '#334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {m === 'ALL' ? 'Complete Curriculum (All Modules)' : m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Select Engine Mode</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => startGame('gender', activeModule)}
                style={{ padding: '16px', fontSize: '14px', fontWeight: '700', backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '10px', cursor: 'pointer' }}
              >
                Gender Trainer<br /><span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>der / die / das (Nouns)</span>
              </button>
              <button
                onClick={() => startGame('translation', activeModule)}
                style={{ padding: '16px', fontSize: '14px', fontWeight: '700', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #059669', borderRadius: '10px', cursor: 'pointer' }}
              >
                Translation Recall<br /><span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>Phrases & Meaning</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'GAME' && currentItem && (
        <div style={{ width: '100%', maxWidth: '560px', background: '#1e293b', padding: '28px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #334155', marginBottom: '18px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: activeMode === 'gender' ? '#38bdf8' : '#10b981' }}>
              {activeMode === 'gender' ? 'ARTICLE TRAINER' : 'COMMUNICATIVE TRANSLATION'} • <span style={{ color: '#94a3b8', fontWeight: '500' }}>{selectedModule}</span>
            </span>
            <button onClick={() => setView('MENU')} style={{ background: '#334155', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Exit</button>
          </div>

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

          <div style={{ textAlign: 'center', padding: '16px 0 24px 0' }}>
            <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '8px' }}>
              {currentItem.german}
            </div>
            
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
              {activeMode === 'gender' 
                ? `Select grammatical article (Meaning: "${currentItem.english}")` 
                : 'Translate into English'}
            </div>

            {feedback ? (
              <div style={{ padding: '14px 20px', borderRadius: '8px', fontSize: '16px', fontWeight: '700', backgroundColor: feedback.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: feedback.ok ? '#34d399' : '#f87171', border: `1px solid ${feedback.ok ? '#059669' : '#dc2626'}` }}>
                {feedback.msg}
              </div>
            ) : activeMode === 'gender' ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => submitGender('der')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>der</button>
                <button onClick={() => submitGender('die')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#db2777', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>die</button>
                <button onClick={() => submitGender('das')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>das</button>
              </div>
            ) : (
              <form onSubmit={submitTranslation} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <input 
                  type="text" 
                  value={inputVal} 
                  onChange={e => setInputVal(e.target.value)} 
                  placeholder="Type English translation..." 
                  autoFocus
                  style={{ width: '100%', maxWidth: '380px', padding: '14px 16px', fontSize: '16px', borderRadius: '10px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ padding: '12px 36px', fontSize: '15px', fontWeight: '700', backgroundColor: '#10b981', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Submit</button>
              </form>
            )}
          </div>
        </div>
      )}

      {view === 'RESULT' && (
        <div style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '36px 28px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', color: '#ef4444', margin: '0 0 10px 0', fontWeight: '800' }}>SESSION COMPLETE</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 24px 0' }}>Final Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
          <button onClick={() => setView('MENU')} style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return to Curriculum</button>
        </div>
      )}
    </div>
  );
}

export default App;