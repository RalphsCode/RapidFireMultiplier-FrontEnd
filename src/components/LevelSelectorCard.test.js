import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Provides a mock router context
import HomePageCard from './HomePageCard';

test('renders "Scores"', () => {
  const mockHandleGuest = jest.fn(); // Mock the handleGuest function

  render(
    <MemoryRouter>
      <HomePageCard handleGuest={mockHandleGuest} />
    </MemoryRouter>
  );

  // Assert that "Scores" text is present
  expect(screen.getByText(/scores/i)).toBeInTheDocument();
});
