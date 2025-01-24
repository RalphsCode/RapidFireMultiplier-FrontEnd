import React from "react";
import { useNavigate } from 'react-router-dom';

const HomePageCard = ({handleGuest}) => {
  
  const navigate = useNavigate(); 
  return (
    <div className="auth-container">
      <h1>Welcome to the Rapid Fire Multiplier</h1>
      <h2>Login or Register to save your scores.</h2>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')}>Register</button>
      <button onClick={handleGuest}>Continue as Guest</button>
    </div>
  );
};

export default HomePageCard;