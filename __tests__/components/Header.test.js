import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  signOut: jest.fn(),
}));

jest.mock('@/hooks/useFavorites', () => () => ({ favorites: [] }));

test('renders logo and guest navigation links when logged out', () => {
  render(<Header />);
  expect(screen.getByText('📚 LibraShelf')).toBeInTheDocument();
  expect(screen.getByText('Hyrje')).toBeInTheDocument();
  expect(screen.getByText('Regjistrohu')).toBeInTheDocument();
});
