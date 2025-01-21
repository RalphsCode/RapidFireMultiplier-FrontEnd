 // Send the game data to the database via API
 const UpdateGameScore = async ( user, level, gameData, score, hiScore, totalPoints ) => {
  const scoreData = {
    difficulty: level,
    q_and_a: gameData,
    score: score,
    curr_hi_score: hiScore,
    total_points: totalPoints,
  };
  console.log("scoreData to go to data API:", scoreData);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}data/${user.username}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Game score updated successfully', result);
    } else {
      console.error('Error updating score');
    }
  } catch (error) {
    console.error('Error with API request:', error);
  }
};  // END UpdateGameScore


// Update the User table with the hi-score and total points
const UpdateUser = async ( user, hiScore, totalPoints) => {
  const updateData = {
    curr_hi_score: hiScore,
    total_points: totalPoints,
  };
  console.log("User update data:", updateData);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}users/${user.username}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User Scores updated successfully', result);
    } else {
      console.error('Error updating User scores');
    }
  } catch (error) {
    console.error('Error with API request:', error);
  }
};    // END UpdateUser()

export { UpdateGameScore, UpdateUser };