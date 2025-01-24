
import '@testing-library/jest-dom';
import { render, screen, fireEvent  } from '@testing-library/react';
import CountdownCard from './CountdownCard';

test('renders "Game starts in"', () => {
  render(<CountdownCard />); 
  expect(screen.getByText(/Game starts in/i)).toBeInTheDocument(); 
});
