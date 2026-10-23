import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dashboard, task filters, and hosted server wake-up guidance', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /good (morning|afternoon|evening)/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /due today/i })).toBeInTheDocument();
  expect(await screen.findByText(/hosted server may take up to a minute to start/i)).toBeInTheDocument();
});
