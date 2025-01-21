import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GameNavBar.css'; 

// THis Component is the NavBar used in the APP
const GameNavBar = () => {
  const navigate = useNavigate();
  // Check if there is a user in localStorage
  const storedUser = JSON.parse(localStorage.getItem('user')) || null;

  // Login button redirect
  const onLogin = () => {
    navigate('/Login'); 
  };

  // Register button redirect
  const onRegister = () => {
    navigate('/Register'); 
  };

  // Logout button handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('hiScore');
    localStorage.removeItem('totalPoints');
     // Refresh the page after logout
    window.location.reload();
  };

  //////////////////////////  RETURN ////////////////////////
  return (
    <nav className="navbar">
      <div className="navbar-brand"><Link to="/" >Rapid Fire Multiplier</Link></div>
      <div className="navbar-links">
        {/* 2 states depending if there is a user logged in or not */}
        {storedUser && storedUser.username !== 'Guest' ? (
          <>
            <span className="welcome-text">
              Welcome, {storedUser.username}!
            </span>
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn register-btn" onClick={onRegister}>
              Register
            </button>
            <button className="btn login-btn" onClick={onLogin}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default GameNavBar;
