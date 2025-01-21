// Rapid Fire Multiplier Game
// Author: RalphsCode (RalphsCode@gmail.com)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import GameHistory from './GameHistory';  // Not using currently, may do in future
import { UpdateGameScore, UpdateUser } from './UpdateGameScore';
import './RapidFireMultiplier.css';


const RapidFireMultiplier = ({ isAuthenticated, toggleAuth }) => {
  const navigate = useNavigate();

  // Define the difficulty levels
  const levels = {
    1: { title: "Starter", time: 30, range1: [1, 9], range2: [1, 12], bonusPoints: 10 },
    2: { title: "Intermediate", time: 40, range1: [1, 20], range2: [1, 50], bonusPoints: 20 },
    3: { title: "Advanced", time: 45, range1: [10, 50], range2: [10, 100], bonusPoints: 30 },
  };

  // UseRef
  const answerInputRef = useRef(null);

  // State definitions
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0 });
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameData, setGameData] = useState([]);
  const [user, setUser] = useState({ username: '', isGuest: true });
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [hiScore, setHiScore] = useState(Number(localStorage.getItem('hiScore')) || 0);
  const [totalPoints, setTotalPoints] = useState(Number(localStorage.getItem('totalPoints')) || 0);

  // function to generate a question/problem/equation at appropriate difficulty
  const generateProblem = () => {
    const { range1, range2 } = levels[level];
    const num1 = Math.floor(Math.random() * (range1[1] - range1[0] + 1)) + range1[0];
    const num2 = Math.floor(Math.random() * (range2[1] - range2[0] + 1)) + range2[0];
    setProblem({ num1, num2 });
  };

  // Set up / Reset game settings
  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setScore(levels[selectedLevel].bonusPoints);
    setCorrectAnswers(0);
    setAttemptedQuestions(0);
    setGameData([]);
    setTimeLeft(levels[selectedLevel].time);
    setCountdown(3);
    setIsGameRunning(false);

    // Start a game
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsGameRunning(true);
          generateProblem();
          requestAnimationFrame(() => {
            // Put the focus in the Input box
            if (answerInputRef.current) {
              answerInputRef.current.focus();
            }
          });
        }
        return prev - 1;
      });
    }, 800);
  };

  useEffect(() => {
    if (isGameRunning && timeLeft > 0) {
      // Game timer is multiple 1 second timers
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameRunning) {
      
      // Game over - Update totalPoints with up to date data 
          const newTotalPoints = totalPoints + score;
          setTotalPoints(newTotalPoints);
          localStorage.setItem('totalPoints', newTotalPoints);

          // Update the hi-score as needed
          if (score > hiScore) {
            setHiScore(score);
            localStorage.setItem('hiScore', score);
          }

          // Send the data to the 2 functions to update the db tables
          UpdateGameScore(user, level, gameData, score, hiScore, newTotalPoints);
          UpdateUser(user, hiScore, newTotalPoints);
          setIsGameRunning(false);
    }
  }, [isGameRunning, timeLeft, score, hiScore, user, level, gameData, totalPoints]);

  // set totalPoints to localStorage with up to date data
  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints);
  }, [totalPoints]);

  // Function to handle when the user submits an answer
  const checkAnswer = () => {
    const correctAnswer = problem.num1 * problem.num2;
    const isCorrect = parseInt(userAnswer, 10) === correctAnswer;

    // Add the question and response to the gameData State
    setGameData((prevData) => [
      ...prevData,
      {
        Q: `${problem.num1} x ${problem.num2}`,
        correctAnswer,
        entAns: userAnswer,
        level,
        isCorrect,
      },
    ]);

    // Update question total count
    setAttemptedQuestions((prev) => prev + 1);

    // Handle correct or incorrect answer
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setFeedback(
        <strong style={{ color: 'green' }}>
          ✔️ Correct!
        </strong>
      );
      setScore((prevScore) => prevScore + 10);
    } else {
      setFeedback(
        <strong style={{ color: 'red' }}>
          ❌ Incorrect! {correctAnswer}.
        </strong>
      );
    }

    // Answer Feedback Timer
    setTimeout(() => setFeedback(''), 1500);
    setUserAnswer('');
    generateProblem();
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedTotalPoints = Number(localStorage.getItem('totalPoints')) || 0;
    if (storedUser) {
      setUser(storedUser);
      toggleAuth(true);
      setTotalPoints(storedTotalPoints);
    }
  }, []);

  const handleLogin = () => {
      navigate('/login');
  };

  const handleRegister = () => {
      navigate('/register');
  };

  const handleGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
    toggleAuth(true);
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  };

  const cancelGame = () => {
    setIsGameRunning(false);
    setTimeLeft(null);
    setCountdown(3);
  };

  //////////////////////////////////  RETURN   ////////////////////////////////////////

  return (
    <div className="game-container">
      {!isAuthenticated && (
        <div className="auth-container">

        {/* Home Page Card */}
          <h1>Welcome to the Rapid Fire Multiplier</h1>
          <h2>Login or Register to save your scores.</h2>
          <button onClick={handleLogin}>
            Login
          </button>
          <button onClick={handleRegister}>
            Register
          </button>
          <button onClick={handleGuest}>Continue as Guest</button>
        </div>
      )}
  
     {/* Select Level Card */}
      {isAuthenticated && !isGameRunning && timeLeft === null && (
        <div className="level-selector">
          <h2>Welcome, {user.username}!</h2>
          {user.username === "Guest" && (
        <div>
          <Link to="/register">Register</Link> or <Link to="/login">Login</Link>
          &nbsp;to save your scores
        </div>
      )}
          <br />
          <h2>Select Level:</h2>
          {Object.entries(levels).map(([lvl, { title }]) => (
            <button key={lvl} onClick={() => startGame(Number(lvl))}>
              {title}
            </button>
          ))}
        </div>
      )}  
  
      {/* Countdown to game start */}
      {countdown > 0 && !isGameRunning && timeLeft !== null && (
        <div>
          <h2>Game starts in: {countdown}</h2>
          <h3>Hi Score: {hiScore}</h3>
        </div>
      )}
  
      {isGameRunning && (
        <div className="game">

        {/* Game Play Status Card */}
          <h2>Level: {level}</h2>
          <h2>Time Left: {timeLeft} seconds</h2>
          <h2>Score: {score}</h2>
          {/* Took this out as clutter, may use the code later
          <div className="stats">
            <h3>Problems Attempted: {attemptedQuestions}</h3>
            <h3>Correct Answers: {correctAnswers}</h3>
            <h3>Incorrect Answers: {attemptedQuestions - correctAnswers}</h3>
          </div> */}

        {/* Game Play Card */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h3>{problem.num1} x {problem.num2}</h3>
              <input
                ref={answerInputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                className="px-2 py-1"
              />
              <button 
                onClick={checkAnswer}
                className="px-4 py-1"
              >
                Submit
              </button>
            </div>
            
            {feedback && (
              <div className="w-full">
                <p className="feedback">{feedback}</p>
              </div>
            )}
          </div>
          <button onClick={cancelGame} className="cancel-button">End Game</button>
          {/* Took this out as it was clutter and needs style/formatting */}
          {/* <GameHistory gameData={gameData} /> */}
        </div>
      )}

      {/* GAME OVER */}
      {!isGameRunning && timeLeft === 0 && (
        <div className="game-over">

          {/* Game Over, Display Result / Score */}
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
      )}
    </div>
  );    // END return
  
};  // END RapidFireMultiplier

export default RapidFireMultiplier;