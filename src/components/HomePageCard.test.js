
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePageCard from './HomePageCard';

test('renders "Welcome" text and buttons', () => {
  // Mock the handleGuest function
  const mockHandleGuest = jest.fn();

  // Render the component inside MemoryRouter
  render(
    <MemoryRouter>
      <HomePageCard handleGuest={mockHandleGuest} />
    </MemoryRouter>
  );

  // Assertions
  expect(screen.getByText(/Welcome to the Rapid Fire Multiplier/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Continue as Guest/i })).toBeInTheDocument();
});
