import React from "react";

const CountdownCard = ({ countdown, hiScore }) => (
  <div>
    <h2>Game starts in: {countdown}</h2>
    <h3>Hi Score: {hiScore}</h3>
  </div>
);

export default CountdownCard;
