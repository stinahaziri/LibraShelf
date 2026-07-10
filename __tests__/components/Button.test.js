import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

test('renders children and handles click', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click Me</Button>);

  const btn = screen.getByRole('button', { name: /click me/i });
  expect(btn).toBeInTheDocument();

  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('disables the button when disabled prop is true', () => {
  render(<Button disabled>Disabled</Button>);
  expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
});
