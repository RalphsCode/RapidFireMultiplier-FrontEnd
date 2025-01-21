import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import GameNavBar from './GameNavBar';
import RapidFireMultiplier from './RapidFireMultiplier';
import Login from './Login';
import Register from './Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update isAuthenticated, passed to child Components
  const authUpdater = (state) => {
    setIsAuthenticated(state);
  };

  /////////////////////////////////// RETURN //////////////////////////////////
  return (
    <>
      <GameNavBar />
      <Routes>
        <Route
          path="/"
          element={<RapidFireMultiplier isAuthenticated={isAuthenticated} toggleAuth={authUpdater} />}
        />
        <Route
          path="/login"
          element={<Login isAuthenticated={isAuthenticated} toggleAuth={authUpdater} />}
        />
                <Route
          path="/register"
          element={<Register isAuthenticated={isAuthenticated} toggleAuth={authUpdater} />}
        />
      </Routes>
    </>
  );
}

export default App;

