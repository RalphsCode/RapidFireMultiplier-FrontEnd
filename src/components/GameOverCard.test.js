
import '@testing-library/jest-dom';
import { render, screen  } from '@testing-library/react';
import GameOverCard from './GameOverCard';

test('renders "Game Over"', () => {
    // Create a fake user
  const user = {username: "TestUser"};
  render(<GameOverCard user={user}/>); 
  expect(screen.getByText(/Game over/i)).toBeInTheDocument(); 
});
