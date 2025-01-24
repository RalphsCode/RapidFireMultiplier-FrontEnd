import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateGameScore, UpdateUser } from './UpdateGameScore';
import './RapidFireMultiplier.css';
import HomePageCard from "./components/HomePageCard";
import LevelSelectorCard from "./components/LevelSelectorCard";
import CountdownCard from "./components/CountdownCard";
import GamePlayCard from "./components/GamePlayCard";
import GameOverCard from "./components/GameOverCard";

const LEVELS = {
  1: { title: "Starter", time: 30, range1: [1, 9], range2: [1, 12], bonusPoints: 10 },
  2: { title: "Intermediate", time: 40, range1: [1, 20], range2: [1, 50], bonusPoints: 20 },
  3: { title: "Advanced", time: 45, range1: [10, 50], range2: [10, 100], bonusPoints: 30 },
};

const RapidFireMultiplier = ({ isAuthenticated, toggleAuth }) => {

  const navigate = useNavigate();
  const answerInputRef = useRef(null);

  // Game state
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0 });
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameData, setGameData] = useState([]);
  
  // User state
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : { username: '', isGuest: true };
  });
  
  // Statistics state
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [hiScore, setHiScore] = useState(() => 
    Number(localStorage.getItem('hiScore')) || 0
  );
  const [totalPoints, setTotalPoints] = useState(() => 
    Number(localStorage.getItem('totalPoints')) || 0
  );

  const generateProblem = () => {
    const { range1, range2 } = LEVELS[level];
    const num1 = Math.floor(Math.random() * (range1[1] - range1[0] + 1)) + range1[0];
    const num2 = Math.floor(Math.random() * (range2[1] - range2[0] + 1)) + range2[0];
    setProblem({ num1, num2 });
  };

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setScore(LEVELS[selectedLevel].bonusPoints);
    setCorrectAnswers(0);
    setAttemptedQuestions(0);
    setGameData([]);
    setTimeLeft(LEVELS[selectedLevel].time);
    setCountdown(3);
    setIsGameRunning(false);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsGameRunning(true);
          generateProblem();
          requestAnimationFrame(() => {
            answerInputRef.current?.focus();
          });
        }
        return prev - 1;
      });
    }, 800);
  };

  //  Handle End Of Game
  const handleGameOver = () => {
    const newTotalPoints = totalPoints + score;
    setTotalPoints(newTotalPoints);
    localStorage.setItem('totalPoints', newTotalPoints);
    setIsGameRunning(false);

    if (score > hiScore) {
      setHiScore(score);
      localStorage.setItem('hiScore', score);
    
      // Use `score` directly since it is the new high score and
      // bypass the asynchrious nature of setHiScore
      UpdateGameScore(user, level, gameData, score, score, newTotalPoints);
      UpdateUser(user, score, newTotalPoints);
    } else {
      // Use the current hiScore
      UpdateGameScore(user, level, gameData, score, hiScore, newTotalPoints);
      UpdateUser(user, hiScore, newTotalPoints);
    }
  };  // END handleGameOver

  const checkAnswer = () => {
    const correctAnswer = problem.num1 * problem.num2;
    const isCorrect = parseInt(userAnswer, 10) === correctAnswer;

    setGameData(prevData => [...prevData, {
      Q: `${problem.num1} x ${problem.num2}`,
      correctAnswer,
      entAns: userAnswer,
      level,
      isCorrect,
    }]);  // END setGameData

    setAttemptedQuestions(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setFeedback(<strong style={{ color: 'green' }}>✔️ Correct!</strong>);
      setScore(prevScore => prevScore + 10);
    } else {
      setFeedback(
        <strong style={{ color: 'red' }}>❌ Incorrect! {correctAnswer}.</strong>
      );
    }

    setTimeout(() => setFeedback(''), 1500);
    setUserAnswer('');
    generateProblem();
  };

  // Game timer effect
  useEffect(() => {
    if (isGameRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameRunning) {
      handleGameOver();
    }
  }, [isGameRunning, timeLeft]);

  // Persist total points
  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints);
  }, [totalPoints]);

  // Load user data on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      toggleAuth(true);
      setTotalPoints(Number(localStorage.getItem('totalPoints')) || 0);
    }
  }, []);

  // Homepage login/register/guest buttons
  const handleAuth = {
    login: () => navigate('/login'),
    register: () => navigate('/register'),
    guest: () => {
      const guestUser = { username: 'Guest', isGuest: true };
      setUser(guestUser);
      toggleAuth(true);
      localStorage.setItem('user', JSON.stringify(guestUser));
    }
  };


  const handleGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
    toggleAuth(true);
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  };

  return (
    <div className="game-container">
      {!isAuthenticated && (
        <HomePageCard handleGuest={handleGuest} />
      )}
      
      {isAuthenticated && !isGameRunning && timeLeft === null && (
        <LevelSelectorCard 
          user={user} 
          levels={LEVELS} 
          startGame={startGame} 
        />
      )}
      
      {countdown > 0 && !isGameRunning && timeLeft !== null && (
        <CountdownCard 
          countdown={countdown} 
          hiScore={hiScore} 
        />
      )}
      
      {isGameRunning && (
        <GamePlayCard
          level={level}
          timeLeft={timeLeft}
          score={score}
          problem={problem}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          checkAnswer={checkAnswer}
          feedback={feedback}
          cancelGame={() => {
            setIsGameRunning(false);
            setTimeLeft(null);
            setCountdown(3);
          }}
          answerInputRef={answerInputRef}
        />
      )}
      
      {!isGameRunning && timeLeft === 0 && (
        <GameOverCard
          user={user}
          correctAnswers={correctAnswers}
          attemptedQuestions={attemptedQuestions}
          score={score}
          hiScore={hiScore}
          totalPoints={totalPoints}
          level={level}
          startGame={startGame}
        />
      )}
    </div>
  );    // END RETURN STATEMENT
};

export default RapidFireMultiplier;