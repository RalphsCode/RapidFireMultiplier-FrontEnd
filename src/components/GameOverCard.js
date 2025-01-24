import React from "react";

const GameOverCard = ({
  user,
  correctAnswers,
  attemptedQuestions,
  score,
  hiScore,
  totalPoints,
  level,
  startGame,
}) => (
  <div className="game-over">
    <h2>Game Over {user.username}!</h2>
    <h3>{Math.round((correctAnswers / attemptedQuestions) * 100) || 0}% Correct</h3>
    <h3>Score: {score}</h3>
    <h3>High Score: {user.username === "Guest" ? " Register/Login for this feature" : hiScore}</h3>
    <h3>Total Points: {user.username === "Guest" ? " Register/Login for this feature" : totalPoints}</h3>
    <h3>Equations: {attemptedQuestions}</h3>
    <h3>Correct Answers: {correctAnswers}</h3>
    <h3>Incorrect Answers: {attemptedQuestions - correctAnswers}</h3>
    <button onClick={() => startGame(level)}>Play Again</button>
  </div>
);

export default GameOverCard;
