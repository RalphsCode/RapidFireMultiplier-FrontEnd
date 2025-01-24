import React from "react";
import { Link } from "react-router-dom";

const LevelSelectorCard = ({ user, levels, startGame }) => (
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
);

export default LevelSelectorCard;
