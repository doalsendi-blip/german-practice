import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import rawData from './data/vocabulary.json';

const SRS_STORAGE_KEY = 'DEUTSCH_MUNDLICH_SRS_V1';

function getLevenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function updateSrsItem(itemRecord, gradeQuality) {
  let { repetitions = 0, interval = 1, easeFactor = 2.5 } = itemRecord || {};

  if (gradeQuality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - gradeQuality) * (0.08 + (5 - gradeQuality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    repetitions,
    interval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    dueDate: Date.now() + interval * 24 * 60 * 60 * 1000,
    lastReviewed: Date.now()
  };
}

function speakGerman(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  const deVoice = voices.find(v => v.lang === 'de-DE' || v.lang.startsWith('de'));
  if (deVoice) utterance.voice = deVoice;
  window.speechSynthesis.speak(utterance);
}

function App() {
  const [view, setView] = useState('MENU');
  const [activeLevel, setActiveLevel] = useState(3);
  const [activeMode, setActiveMode] = useState('recognition');
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [showPattern, setShowPattern] = useState(false);
  const [options, setOptions] = useState([]);
  const [cipherInput, setCipherInput] = useState('');
  
  const [srsData, setSrsData] = useState(() => {
    try {
      const stored = localStorage.getItem(SRS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const saveSrsRecord = useCallback((itemId, grade) => {
    setSrsData(prev => {
      const updated = { ...prev, [itemId]: updateSrsItem(prev[itemId], grade) };
      try {
        localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('SRS write failed', e);
      }
      return updated;
    });
  }, []);

  const generateDistractors = useCallback((targetItem) => {
    let sameTypePool = rawData.filter(p => p.id !== targetItem.id && p.type === targetItem.type);

    const isMultiWord = targetItem.english.includes(' ');
    if (isMultiWord) {
      const multiWordPhrases = sameTypePool.filter(p => p.english.includes(' '));
      if (multiWordPhrases.length >= 3) {
        sameTypePool = multiWordPhrases;
      }
    }

    const uniqueEnglish = Array.from(new Set(sameTypePool.map(p => p.english)));
    const shuffled = uniqueEnglish.sort(() => Math.random() - 0.5).slice(0, 3);
    shuffled.push(targetItem.english);
    return shuffled.sort(() => Math.random() - 0.5);
  }, []);

  const launchEngine = (mode, level) => {
    let pool = rawData.filter(d => d.level === level);

    if (mode === 'gender') {
      pool = pool.filter(d => d.type === 'noun' && d.gender);
    } else if (mode === 'cipher') {
      pool = pool.filter(d => d.shift_rule && d.source_english);
    }

    if (pool.length === 0) {
      alert('No matching vocabulary items available for this difficulty level and mode.');
      return;
    }

    const now = Date.now();
    const sortedPool = [...pool].sort((a, b) => {
      const aDue = srsData[a.id]?.dueDate || 0;
      const bDue = srsData[b.id]?.dueDate || 0;
      if (aDue < now && bDue >= now) return -1;
      if (bDue < now && aDue >= now) return 1;
      return Math.random() - 0.5;
    });

    setDeck(sortedPool);
    setActiveMode(mode);
    setActiveLevel(level);
    setIdx(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setFeedback(null);
    setShowPattern(false);
    setCipherInput('');

    if (mode === 'recognition') {
      setOptions(generateDistractors(sortedPool[0]));
    }

    speakGerman(sortedPool[0].german);
    setView('GAME');
  };

  const currentItem = useMemo(() => deck[idx] || null, [deck, idx]);

  const evaluateAnswer = useCallback((isCorrect, gradeQuality, answerContext) => {
    if (!currentItem) return;

    saveSrsRecord(currentItem.id, gradeQuality);

    if (isCorrect) {
      const multiplier = Math.floor(streak / 3) + 1;
      const points = 10 * multiplier;
      setScore(s => s + points);
      setStreak(st => st + 1);
      setFeedback({
        status: 'correct',
        headline: `RICHTIG (+${points} pts)`,
        subtext: answerContext,
        tip: currentItem.tip
      });
      speakGerman(currentItem.german);
    } else {
      const remainingLives = lives - 1;
      setLives(remainingLives);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        headline: 'NICHT KORREKT',
        subtext: answerContext,
        tip: currentItem.tip
      });
      speakGerman(currentItem.german);

      if (remainingLives <= 0) {
        setTimeout(() => setView('RESULT'), 2500);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShowPattern(false);
      setCipherInput('');
      const nextIndex = (idx + 1) % deck.length;
      setIdx(nextIndex);

      if (activeMode === 'recognition') {
        setOptions(generateDistractors(deck[nextIndex]));
      }
      speakGerman(deck[nextIndex].german);
    }, 2400);
  }, [currentItem, deck, idx, lives, streak, activeMode, generateDistractors, saveSrsRecord]);

  const handleGenderChoice = useCallback((article) => {
    if (!currentItem || feedback) return;
    const match = article === currentItem.gender;
    evaluateAnswer(match, match ? 5 : 1, `${currentItem.gender} ${currentItem.german} (${currentItem.english})`);
  }, [currentItem, feedback, evaluateAnswer]);

  const handleRecognitionChoice = useCallback((choice) => {
    if (!currentItem || feedback) return;
    const match = choice === currentItem.english;
    evaluateAnswer(match, match ? 5 : 1, `${currentItem.german} = ${currentItem.english}`);
  }, [currentItem, feedback, evaluateAnswer]);

  const handleCipherSubmit = (e) => {
    if (e) e.preventDefault();
    if (!cipherInput.trim() || !currentItem || feedback) return;

    const normalizedInput = cipherInput.trim().toLowerCase();
    const normalizedTarget = currentItem.german.toLowerCase();
    const dist = getLevenshteinDistance(normalizedInput, normalizedTarget);

    if (dist === 0) {
      evaluateAnswer(true, 5, `Target: ${currentItem.german}`);
    } else if (dist <= 1) {
      evaluateAnswer(true, 3, `Accepted with minor deviation: ${currentItem.german}`);
    } else {
      evaluateAnswer(false, 1, `Target Transformation: ${currentItem.german}`);
    }
  };

  useEffect(() => {
    if (view !== 'GAME' || feedback) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'escape') {
        setView('MENU');
        return;
      }
      if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        if (currentItem) speakGerman(currentItem.german);
        return;
      }
      if (key === 'h') {
        setShowPattern(p => !p);
        return;
      }

      if (activeMode === 'gender') {
        if (key === '1') handleGenderChoice('der');
        if (key === '2') handleGenderChoice('die');
        if (key === '3') handleGenderChoice('das');
      } else if (activeMode === 'recognition') {
        if (['1', '2', '3', '4'].includes(key)) {
          const optIdx = parseInt(key, 10) - 1;
          if (options[optIdx]) handleRecognitionChoice(options[optIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, activeMode, feedback, currentItem, options, handleGenderChoice, handleRecognitionChoice]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
      
      {view === 'MENU' && (
        <div style={{ width: '100%', maxWidth: '580px', background: '#131b2e', padding: '36px 32px', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '28px', color: '#38bdf8', fontWeight: '800', letterSpacing: '-0.02em' }}>DEUTSCH MÜNDLICH</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Systematic Germanic Cognates & Morphosyntax Framework</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>1. Curriculum Level</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '10px' }}>
              {[
                { lvl: 1, title: 'Level 1: High German Sound Shifts & Transparent Roots', desc: 'Consonant shifts (t -> ss/z, d -> t, p -> pf, k -> ch) & direct cognates' },
                { lvl: 2, title: 'Level 2: Suffix Morphosyntax & Deterministic Gender', desc: '-ung (die), -heit/keit (die), -chen (das), -er (der)' },
                { lvl: 3, title: 'Level 3: Multi-Word Phrases & Dative/Accusative Logic', desc: 'Plausible communicative distractor matching & idiomatic chunks' }
              ].map(tier => (
                <button
                  key={tier.lvl}
                  onClick={() => setActiveLevel(tier.lvl)}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: activeLevel === tier.lvl ? '#0369a1' : '#0a101d',
                    color: '#f8fafc',
                    border: '1px solid',
                    borderColor: activeLevel === tier.lvl ? '#38bdf8' : '#1e293b',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{tier.title}</div>
                  <div style={{ fontSize: '12px', color: activeLevel === tier.lvl ? '#e0f2fe' : '#64748b', marginTop: '3px' }}>{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>2. Training Engine</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => launchEngine('gender', activeLevel)}
                style={{ padding: '16px 12px', backgroundColor: '#0a101d', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Article Trainer</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>der / die / das (1, 2, 3)</div>
              </button>
              <button
                onClick={() => launchEngine('recognition', activeLevel)}
                style={{ padding: '16px 12px', backgroundColor: '#0a101d', color: '#10b981', border: '1px solid #059669', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Recall Quiz</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Context Distractors (1-4)</div>
              </button>
              <button
                onClick={() => launchEngine('cipher', activeLevel)}
                style={{ padding: '16px 12px', backgroundColor: '#0a101d', color: '#f59e0b', border: '1px solid #d97706', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: '14px', fontWeight: '800' }}>Cognate Cipher</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Phonetic Shift Input</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'GAME' && currentItem && (
        <div style={{ width: '100%', maxWidth: '620px', background: '#131b2e', padding: '28px', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #1e293b', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#38bdf8' }}>
                LEVEL {activeLevel}
              </span>
              {currentItem.category && (
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  {currentItem.category}
                </span>
              )}
            </div>
            <button onClick={() => setView('MENU')} style={{ background: '#1e293b', border: 'none', color: '#f87171', fontSize: '11px', fontWeight: '800', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', textTransform: 'uppercase' }}>
              [ESC] Exit
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            <div style={{ background: '#0a101d', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>SCORE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>{score}</div>
            </div>
            <div style={{ background: '#0a101d', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>STREAK</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>{streak}x</div>
            </div>
            <div style={{ background: '#0a101d', padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>LIVES</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444', letterSpacing: '3px' }}>
                {Array.from({ length: 3 }).map((_, i) => (i < lives ? '●' : '○')).join(' ')}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                {activeMode === 'cipher' ? currentItem.source_english : currentItem.german}
              </span>
              <button
                onClick={() => speakGerman(currentItem.german)}
                title="Audio Pronunciation [Space]"
                style={{ background: '#1e293b', border: 'none', color: '#38bdf8', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                🔊
              </button>
            </div>

            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '18px' }}>
              {activeMode === 'gender' && `Select grammatical gender (Meaning: "${currentItem.english}")`}
              {activeMode === 'recognition' && (currentItem.type === 'phrase' ? 'Select matching communicative translation' : 'Select English translation')}
              {activeMode === 'cipher' && `Apply sound shift [${currentItem.shift_rule}] to generate German root`}
            </div>

            {currentItem.tip && !feedback && (
              <div style={{ marginBottom: '22px' }}>
                <button
                  onClick={() => setShowPattern(s => !s)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {showPattern ? 'Hide Linguistic Pattern [H]' : '💡 Reveal Linguistic Pattern [H]'}
                </button>
                {showPattern && (
                  <div style={{ marginTop: '10px', padding: '12px 16px', backgroundColor: '#0a101d', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', textAlign: 'left' }}>
                    {currentItem.tip}
                  </div>
                )}
              </div>
            )}

            {feedback ? (
              <div style={{ padding: '16px 20px', borderRadius: '10px', backgroundColor: feedback.status === 'correct' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${feedback.status === 'correct' ? '#059669' : '#dc2626'}`, textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '800', color: feedback.status === 'correct' ? '#34d399' : '#f87171', marginBottom: '4px' }}>
                  {feedback.headline}
                </div>
                <div style={{ fontSize: '14px', color: '#f8fafc', marginBottom: '8px' }}>
                  {feedback.subtext}
                </div>
                {feedback.tip && (
                  <div style={{ fontSize: '12px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', lineHeight: '1.4' }}>
                    <strong>Morphemic Analysis:</strong> {feedback.tip}
                  </div>
                )}
              </div>
            ) : activeMode === 'gender' ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                {['der', 'die', 'das'].map((art, idx) => (
                  <button
                    key={art}
                    onClick={() => handleGenderChoice(art)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      fontSize: '18px',
                      fontWeight: '800',
                      backgroundColor: art === 'der' ? '#0284c7' : art === 'die' ? '#db2777' : '#059669',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{art}</span>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>[{idx + 1}]</span>
                  </button>
                ))}
              </div>
            ) : activeMode === 'recognition' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecognitionChoice(opt)}
                    style={{
                      padding: '14px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: '#0a101d',
                      color: '#f8fafc',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      lineHeight: '1.4'
                    }}
                  >
                    <span>{opt}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', marginLeft: '8px' }}>[{i + 1}]</span>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleCipherSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <input
                  type="text"
                  value={cipherInput}
                  onChange={e => setCipherInput(e.target.value)}
                  placeholder="Enter German transformation..."
                  autoFocus
                  style={{ width: '100%', maxWidth: '380px', padding: '14px 16px', fontSize: '18px', fontWeight: '700', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0a101d', color: '#ffffff', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ padding: '12px 36px', fontSize: '14px', fontWeight: '800', backgroundColor: '#f59e0b', color: '#090d16', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Execute Transformation [Enter]
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {view === 'RESULT' && (
        <div style={{ width: '100%', maxWidth: '440px', background: '#131b2e', padding: '36px 28px', borderRadius: '16px', border: '1px solid #1e293b', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#ef4444', margin: '0 0 10px 0', fontWeight: '800' }}>SESSION TERMINATED</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 24px 0' }}>Final Session Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
          <button onClick={() => setView('MENU')} style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', backgroundColor: '#38bdf8', color: '#090d16', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Return to Curriculum
          </button>
        </div>
      )}
    </div>
  );
}

export default App;