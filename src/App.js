import React, { useState, useEffect } from 'react';
import './App.css';

const fullVocabulary = [
  { id: 1, german: 'Apfel', english: 'apple', gender: 'der', category: 'Food' },
  { id: 2, german: 'Haus', english: 'house', gender: 'das', category: 'Living' },
  { id: 3, german: 'Katze', english: 'cat', gender: 'die', category: 'Animals' },
  { id: 4, german: 'Wasser', english: 'water', gender: 'das', category: 'Food' },
  { id: 5, german: 'Hund', english: 'dog', gender: 'der', category: 'Animals' },
  { id: 6, german: 'Buch', english: 'book', gender: 'das', category: 'Education' },
  { id: 7, german: 'Auto', english: 'car', gender: 'das', category: 'Travel' },
  { id: 8, german: 'Tisch', english: 'table', gender: 'der', category: 'Living' },
  { id: 9, german: 'Blume', english: 'flower', gender: 'die', category: 'Nature' },
  { id: 10, german: 'Milch', english: 'milk', gender: 'die', category: 'Food' },
  { id: 11, german: 'Fenster', english: 'window', gender: 'das', category: 'Living' },
  { id: 12, german: 'Straße', english: 'street', gender: 'die', category: 'Travel' },
  { id: 13, german: 'Schule', english: 'school', gender: 'die', category: 'Education' },
  { id: 14, german: 'Baum', english: 'tree', gender: 'der', category: 'Nature' },
  { id: 15, german: 'Sonne', english: 'sun', gender: 'die', category: 'Nature' }
];

function App() {
  const [mode, setMode] = useState('menu'); // 'menu', 'gender', 'quiz', 'flashcards'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledList, setShuffledList] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const startGame = (selectedMode) => {
    const shuffled = [...fullVocabulary].sort(() => Math.random() - 0.5);
    setShuffledList(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setUserInput('');
    setShowAnswer(false);
    setMode(selectedMode);
  };

  const handleGenderAnswer = (selectedGender) => {
    const current = shuffledList[currentIndex];
    if (selectedGender === current.gender) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({ correct: true, text: Correct! Der/Die/Das:   });
    } else {
      setStreak(0);
      setFeedback({ correct: false, text: Incorrect. It is   });
    }
    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((currentIndex + 1) % shuffledList.length);
    }, 1200);
  };

  const handleTypedSubmit = (e) => {
    e.preventDefault();
    const current = shuffledList[currentIndex];
    const cleanInput = userInput.trim().toLowerCase();
    const cleanTarget = current.english.toLowerCase();

    if (cleanInput === cleanTarget) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({ correct: true, text: 'Correct translation!' });
    } else {
      setStreak(0);
      setFeedback({ correct: false, text: Incorrect. Correct answer:  });
    }
    setUserInput('');
    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((currentIndex + 1) % shuffledList.length);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '25px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>???? German Practice Studio</h1>
        {mode !== 'menu' && (
          <button onClick={() => setMode('menu')} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Exit to Menu</button>
        )}
      </header>

      {mode === 'menu' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2 style={{ color: '#34495e', marginBottom: '10px' }}>Select Training Mode</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Choose a module to begin active German drills.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
            <button onClick={() => startGame('gender')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>1. Article Gender Trainer (Der / Die / Das)</button>
            <button onClick={() => startGame('quiz')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>2. Vocabulary Translation Quiz</button>
            <button onClick={() => startGame('flashcards')} style={{ padding: '15px', fontSize: '18px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>3. Interactive Flashcards</button>
          </div>
        </div>
      )}

      {mode !== 'menu' && shuffledList.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', padding: '12px 20px', borderRadius: '8px', marginBottom: '25px', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            <span>Score: {score}</span>
            <span>Streak: {streak} ??</span>
            <span>Progress: {currentIndex + 1} / {shuffledList.length}</span>
          </div>

          {mode === 'gender' && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#fdfefe', border: '1px solid #e1e8ed', borderRadius: '10px' }}>
              <h3 style={{ color: '#7f8c8d' }}>Select the correct grammatical article:</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '30px 0', color: '#2c3e50' }}>{shuffledList[currentIndex].german}</div>
              <p style={{ fontStyle: 'italic', color: '#95a5a6', marginBottom: '30px' }}>Meaning: {shuffledList[currentIndex].english}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => handleGenderAnswer('der')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>der</button>
                <button onClick={() => handleGenderAnswer('die')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>die</button>
                <button onClick={() => handleGenderAnswer('das')} style={{ padding: '12px 30px', fontSize: '18px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>das</button>
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#fdfefe', border: '1px solid #e1e8ed', borderRadius: '10px' }}>
              <h3 style={{ color: '#7f8c8d' }}>Translate this German word to English:</h3>
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '30px 0', color: '#2c3e50' }}>{shuffledList[currentIndex].gender} {shuffledList[currentIndex].german}</div>
              
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
              <div style={{ fontSize: '42px', fontWeight: 'bold', margin: '20px 0', color: '#2c3e50' }}>{shuffledList[currentIndex].gender} {shuffledList[currentIndex].german}</div>
              
              {showAnswer ? (
                <div>
                  <p style={{ fontSize: '28px', color: '#27ae60', margin: '20px 0', fontWeight: 'bold' }}>{shuffledList[currentIndex].english}</p>
                  <button onClick={() => { setShowAnswer(false); setCurrentIndex((currentIndex + 1) % shuffledList.length); }} style={{ padding: '12px 25px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Next Word</button>
                </div>
              ) : (
                <button onClick={() => setShowAnswer(true)} style={{ padding: '12px 25px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Flip Card</button>
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
