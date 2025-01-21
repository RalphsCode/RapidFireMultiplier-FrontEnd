import React from 'react';

// This Component displays the completed questions and answers during the game
// Not using this currently.
const GameHistory = ({ gameData }) => {
  return (
    <div className="game-history">
      <h3>Game History</h3>
      <ul>
        {gameData.slice(0).reverse().map((item, index) => (
          <li key={index}>
            <strong>Q:</strong> {item.question} <br />
            <strong>Your Answer:</strong> {item.enteredAnswer} <br />
            <strong>Correct Answer:</strong> {item.correctAnswer} <br />
            <strong>Result:</strong> {item.isCorrect ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameHistory;