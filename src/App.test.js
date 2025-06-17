import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('toggling a quest updates XP', () => {
  render(<App />);
  const xpDisplay = screen.getByTestId('xp-display');
  expect(xpDisplay).toHaveTextContent('0 XP');
  const checkbox = screen.getAllByRole('checkbox')[0];
  fireEvent.click(checkbox);
  expect(xpDisplay).toHaveTextContent('20 XP');
  fireEvent.click(checkbox);
  expect(xpDisplay).toHaveTextContent('0 XP');
});
