import React, { useState } from 'react';
import './App.css';
import rawData from './data/vocabulary.json';

function App() {
  const [view, setView] = useState('MENU');
  const [activeLevel, setActiveLevel] = useState(1);
  const [activeMode, setActiveMode] = useState('gender');
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [options, setOptions] = useState([]);

  const generateOptions = (currentItem, pool) => {
    const wrong = pool
      .filter(item => item.english !== currentItem.english)
      .map(item => item.english);
    const shuffledWrong = [...new Set(wrong)].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [...shuffledWrong, currentItem.english].sort(() => Math.random() - 0.5);
    return combined;
  };

  const startGame = (mode, level) => {
    let pool = rawData.filter(d => d.level === level);

    if (mode === 'gender') {
      pool = pool.filter(d => d.type === 'noun' && d.gender);
    }

    if (pool.length === 0) {
      alert('No items found for this selection.');
      return;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setActiveMode(mode);
    setActiveLevel(level);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setFeedback(null);
    setShowHint(false);
    if (mode === 'translation') {
      setOptions(generateOptions(shuffled[0], rawData));
    }
    setView('GAME');
  };

  const handleEvaluation = (isCorrect, answerLabel) => {
    const item = deck[idx];
    if (isCorrect) {
      const bonus = Math.floor(streak / 3) + 1;
      const pts = 10 * bonus;
      setScore(s => s + pts);
      setStreak(s => s + 1);
      setFeedback({ ok: true, msg: `CORRECT (+${pts} pts)`, tip: item.tip });
    } else {
      const remainingLives = lives - 1;
      setLives(remainingLives);
      setStreak(0);
      setFeedback({ ok: false, msg: `INCORRECT: ${answerLabel}`, tip: item.tip });
      if (remainingLives <= 0) {
        setTimeout(() => setView('RESULT'), 2500);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      const nextIdx = (idx + 1) % deck.length;
      setIdx(nextIdx);
      if (activeMode === 'translation') {
        setOptions(generateOptions(deck[nextIdx], rawData));
      }
    }, 2500);
  };

  const submitGender = (chosenGender) => {
    const item = deck[idx];
    handleEvaluation(chosenGender === item.gender, `${item.gender} ${item.german} (${item.english})`);
  };

  const submitTranslationChoice = (choice) => {
    const item = deck[idx];
    handleEvaluation(choice === item.english, item.english);
  };

  const currentItem = deck[idx];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      
      {view === 'MENU' && (
        <div style={{ width: '100%', maxWidth: '520px', background: '#1e293b', padding: '36px 32px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', color: '#38bdf8', textAlign: 'center', fontWeight: '800' }}>DEUTSCH MÜNDLICH</h1>
          <p style={{ margin: '0 0 24px 0', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>Scaffolded Structural Cognates & Patterns</p>
          
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Select Difficulty Tier</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => setActiveLevel(1)}
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: activeLevel === 1 ? '#0284c7' : '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid',
                  borderColor: activeLevel === 1 ? '#38bdf8' : '#334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                Level 1: Transparent Cognates & Sound Shifts (t &rarr; d, p &rarr; pf)
              </button>
              <button
                onClick={() => setActiveLevel(2)}
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: activeLevel === 2 ? '#0284c7' : '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid',
                  borderColor: activeLevel === 2 ? '#38bdf8' : '#334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                Level 2: Suffix Rules (-ung, -heit, -chen) & Core Words
              </button>
              <button
                onClick={() => setActiveLevel(3)}
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: activeLevel === 3 ? '#0284c7' : '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid',
                  borderColor: activeLevel === 3 ? '#38bdf8' : '#334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                Level 3: Multi-Word Idioms & Case Logic
              </button>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Select Engine</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => startGame('gender', activeLevel)}
                style={{ padding: '16px', fontSize: '14px', fontWeight: '700', backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '10px', cursor: 'pointer' }}
              >
                Gender Trainer<br /><span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>der / die / das</span>
              </button>
              <button
                onClick={() => startGame('translation', activeLevel)}
                style={{ padding: '16px', fontSize: '14px', fontWeight: '700', backgroundColor: '#0f172a', color: '#10b981', border: '1px solid #059669', borderRadius: '10px', cursor: 'pointer' }}
              >
                Recognition Recall<br /><span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>Multiple Choice Meaning</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'GAME' && currentItem && (
        <div style={{ width: '100%', maxWidth: '560px', background: '#1e293b', padding: '28px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #334155', marginBottom: '18px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: activeMode === 'gender' ? '#38bdf8' : '#10b981' }}>
              {activeMode === 'gender' ? 'ARTICLE TRAINER' : 'RECOGNITION QUIZ'} • Level {activeLevel}
            </span>
            <button onClick={() => setView('MENU')} style={{ background: '#334155', border: 'none', color: '#f87171', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', textTransform: 'uppercase' }}>Exit</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>SCORE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>{score}</div>
            </div>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>STREAK</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>{streak}x</div>
            </div>
            <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>LIVES</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444', letterSpacing: '3px' }}>
                {Array.from({ length: 3 }).map((_, i) => (i < lives ? '●' : '○')).join(' ')}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '8px 0 20px 0' }}>
            <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '6px' }}>
              {currentItem.german}
            </div>
            
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
              {activeMode === 'gender' 
                ? `Identify article (Meaning: "${currentItem.english}")` 
                : 'Select matching English translation'}
            </div>

            {/* Pattern / Rule Hint Button */}
            {currentItem.tip && !feedback && (
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => setShowHint(!showHint)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {showHint ? 'Hide Linguistic Pattern' : '💡 Show Linguistic Pattern'}
                </button>
                {showHint && (
                  <div style={{ marginTop: '8px', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {currentItem.tip}
                  </div>
                )}
              </div>
            )}

            {/* Feedback Display */}
            {feedback ? (
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: feedback.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${feedback.ok ? '#059669' : '#dc2626'}`, textAlign: 'left' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: feedback.ok ? '#34d399' : '#f87171', marginBottom: feedback.tip ? '6px' : '0' }}>
                  {feedback.msg}
                </div>
                {feedback.tip && (
                  <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>
                    <strong>Rule:</strong> {feedback.tip}
                  </div>
                )}
              </div>
            ) : activeMode === 'gender' ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => submitGender('der')} style={{ flex: 1, padding: '14px', fontSize: '18px', fontWeight: '700', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>der</button>
                <button onClick={() => submitGender('die')} style={{ flex: 1, padding: '14px', fontSize: '18px', fontWeight: '700', backgroundColor: '#db2777', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>die</button>
                <button onClick={() => submitGender('das')} style={{ flex: 1, padding: '14px', fontSize: '17px', fontWeight: '700', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>das</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => submitTranslationChoice(opt)}
                    style={{ padding: '14px 16px', fontSize: '15px', fontWeight: '600', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'RESULT' && (
        <div style={{ width: '100%', maxWidth: '420px', background: '#1e293b', padding: '36px 28px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', color: '#ef4444', margin: '0 0 10px 0', fontWeight: '800' }}>SESSION COMPLETE</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 24px 0' }}>Final Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
          <button onClick={() => setView('MENU')} style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return to Menu</button>
        </div>
      )}
    </div>
  );
}

export default App;