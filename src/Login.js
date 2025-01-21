import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

// Function to present and process the Login form, authenticate user, and set localStorage variables
function Login({ isAuthenticated, toggleAuth }) {
  const navigate = useNavigate();
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // FUnction to handle when a user has submitted their credentials
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Ensure username and password are set before accessing
    if (inputUsername.trim() === '' || inputPassword.trim() === '') {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);

    // Send the data to the API endpoint
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}auth/login`, {
        username: inputUsername,  
        password: inputPassword,  
      });

      // Useful to see what the frontend is sending to the backend
      console.log("Username and password going to server via API:", inputUsername, inputPassword);

      // Retrieve the response data
      const {
        username,
        curr_hi_score,
        total_points,
        first_name,
        last_name,
        email,
      } = response.data.user;

      // Store user data
      const userData = {
        username,
        isGuest: false,
        firstName: first_name,
        lastName: last_name,
        email,
      };

      // Set localStorage items
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('hiScore', curr_hi_score || 0);
      localStorage.setItem('totalPoints', total_points || 0);

      // Update authentication state
      toggleAuth(true);

      // Clear form
      setInputUsername('');
      setInputPassword('');

      // Redirect to home page
      navigate('/');
    } catch (error) {
      // Error handling
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////// RETURN //////////////////
  
  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );    // END return
};  // END Login()

export default Login;