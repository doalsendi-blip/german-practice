import React, { useState, useEffect } from 'react';
import './App.css';

// Expanded vocabulary bank categorized for comprehensive practice
const masterVocabulary = [
  { german: 'Apfel', english: 'apple', gender: 'der', category: 'Food' },
  { german: 'Haus', english: 'house', gender: 'das', category: 'Living' },
  { german: 'Katze', english: 'cat', gender: 'die', category: 'Animals' },
  { german: 'Wasser', english: 'water', gender: 'das', category: 'Food' },
  { german: 'Hund', english: 'dog', gender: 'der', category: 'Animals' },
  { german: 'Buch', english: 'book', gender: 'das', category: 'Education' },
  { german: 'Auto', english: 'car', gender: 'das', category: 'Travel' },
  { german: 'Tisch', english: 'table', gender: 'der', category: 'Living' },
  { german: 'Blume', english: 'flower', gender: 'die', category: 'Nature' },
  { german: 'Milch', english: 'milk', gender: 'die', category: 'Food' },
  { german: 'Fenster', english: 'window', gender: 'das', category: 'Living' },
  { german: 'Straße', english: 'street', gender: 'die', category: 'Travel' },
  { german: 'Schule', english: 'school', gender: 'die', category: 'Education' },
  { german: 'Baum', english: 'tree', gender: 'der', category: 'Nature' },
  { german: 'Sonne', english: 'sun', gender: 'die', category: 'Nature' },
  { german: 'Kaffee', english: 'coffee', gender: 'der', category: 'Food' },
  { german: 'Brot', english: 'bread', gender: 'das', category: 'Food' },
  { german: 'Käse', english: 'cheese', gender: 'der', category: 'Food' },
  { german: 'Stuhl', english: 'chair', gender: 'der', category: 'Living' },
  { german: 'Tür', english: 'door', gender: 'die', category: 'Living' }
];

function App() {
  const [mode, setMode] = useState('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wordList, setWordList] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const startGame = (selectedMode) => {
    const shuffled = [...masterVocabulary].sort(() => Math.random() - 0.5);
    setWordList(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setUserInput('');
    setShowAnswer(false);
    setMode(selectedMode);
  };

  const handleGenderAnswer = (selectedGender) => {
    const current = wordList[currentIndex];
    if (selectedGender === current.gender) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({ correct: true, text: Correct!   });
    } else {
      setStreak(0);
      setFeedback({ correct: false, text: Incorrect. It is   });
    }
    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => (prev + 1) % wordList.length);
    }, 1200);
  };

  const handleTypedSubmit = (e) => {
    e.preventDefault();
    const current = wordList[currentIndex];
    if (userInput.trim().toLowerCase() === current.english.toLowerCase()) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({ correct: true, text: 'Correct translation!' });
    } else {
      setStreak(0);
      setFeedback({ correct: false, text: Incorrect. Answer:  });
    }
    setUserInput('');
    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => (prev + 1) % wordList.length);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '25px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>???? German Practice Studio</h1>
        {mode !== 'menu' && (
          <button onClick={() => setMode('menu')} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Menu</button>
        )}
      </header>

      {mode === 'menu' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2>Select Practice Module</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Loaded with dynamic vocabulary banks.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
            <button onClick={() => startGame('gender')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Der / Die / Das Trainer</button>
            <button onClick={() => startGame('quiz')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Translation Quiz</button>
            <button onClick={() => startGame('flashcards')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Flashcards</button>
          </div>
        </div>
      )}

      {mode !== 'menu' && wordList.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', padding: '12px 20px', borderRadius: '8px', marginBottom: '25px', fontSize: '16px', fontWeight: 'bold' }}>
            <span>Score: {score}</span>
            <span>Streak: {streak} ??</span>
            <span>Word: {currentIndex + 1} / {wordList.length}</span>
          </div>

          {mode === 'gender' && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#fdfefe', border: '1px solid #e1e8ed', borderRadius: '10px' }}>
              <h3>Select correct grammatical article:</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '30px 0', color: '#2c3e50' }}>{wordList[currentIndex].german}</div>
              <p style={{ fontStyle: 'italic', color: '#95a5a6', marginBottom: '30px' }}>Meaning: {wordList[currentIndex].english}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => handleGenderAnswer('der')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>der</button>
                <button onClick={() => handleGenderAnswer('die')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>die</button>
                <button onClick={() => handleGenderAnswer('das')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>das</button>
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#fdfefe', border: '1px solid #e1e8ed', borderRadius: '10px' }}>
              <h3>Translate to English:</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '30px 0', color: '#2c3e50' }}>{wordList[currentIndex].gender} {wordList[currentIndex].german}</div>
              <form onSubmit={handleTypedSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                  placeholder="Type English translation..." 
                  autoFocus
                  style={{ padding: '12px', fontSize: '16px', width: '250px', border: '1px solid #bdc3c7', borderRadius: '6px' }}
                />
                <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Submit</button>
              </form>
            </div>
          )}

          {mode === 'flashcards' && (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fdfefe', border: '1px solid #e1e8ed', borderRadius: '10px' }}>
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '20px 0', color: '#2c3e50' }}>{wordList[currentIndex].gender} {wordList[currentIndex].german}</div>
              {showAnswer ? (
                <div>
                  <p style={{ fontSize: '28px', color: '#27ae60', margin: '20px 0', fontWeight: 'bold' }}>{wordList[currentIndex].english}</p>
                  <button onClick={() => { setShowAnswer(false); setCurrentIndex((prev) => (prev + 1) % wordList.length); }} style={{ padding: '12px 25px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Next Word</button>
                </div>
              ) : (
                <button onClick={() => setShowAnswer(true)} style={{ padding: '12px 25px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Flip Card</button>
              )}
            </div>
          )}

          {feedback && (
            <div style={{ marginTop: '20px', padding: '15px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', borderRadius: '6px', backgroundColor: feedback.correct ? '#d4edda' : '#f8d7da', color: feedback.correct ? '#155724' : '#721c24' }}>
              {feedback.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
