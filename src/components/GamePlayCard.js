import React from "react";

const GamePlayCard = ({
  level,
  timeLeft,
  score,
  problem,
  userAnswer,
  setUserAnswer,
  checkAnswer,
  feedback,
  cancelGame,
  answerInputRef,
}) => (
  <div className="game">
    <h2>Level: {level}</h2>
    <h2>Time Left: {timeLeft} seconds</h2>
    <h2>Score: {score}</h2>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3>
          {problem.num1} x {problem.num2}
        </h3>
        <input
          ref={answerInputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          className="px-2 py-1"
        />
        <button onClick={checkAnswer} className="px-4 py-1">
          Submit
        </button>
      </div>
      {feedback && (
        <div className="w-full">
          <p className="feedback">{feedback}</p>
        </div>
      )}
    </div>
    <button onClick={cancelGame} className="cancel-button">
      End Game
    </button>
  </div>
);

export default GamePlayCard;
