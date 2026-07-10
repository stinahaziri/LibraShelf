import { render, screen } from '@testing-library/react';
import BookCard from '@/components/BookCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, sizes, priority, ...rest }) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

jest.mock('@/hooks/useFavorites', () => () => ({
  isFavorite: () => false,
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

const book = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Test Book',
  author: 'Test Author',
  category: 'Roman',
  price: 12.5,
  coverImage: 'https://placehold.co/400x600',
};

test('renders book title, author and price', () => {
  render(<BookCard book={book} />);
  expect(screen.getByText('Test Book')).toBeInTheDocument();
  expect(screen.getByText('Test Author')).toBeInTheDocument();
  expect(screen.getByText('12.50 €')).toBeInTheDocument();
});

test('links to the correct book detail page', () => {
  render(<BookCard book={book} />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', `/books/${book._id}`);
});
