import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/books/index';

jest.mock('@/lib/mongodb', () => jest.fn().mockResolvedValue(true));
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn().mockResolvedValue(null) }));
jest.mock('@/lib/authOptions', () => ({ authOptions: {} }));
jest.mock('@/models/Book', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      lean: jest.fn().mockResolvedValue([{ _id: '1', title: 'Book 1', author: 'Author 1', price: 10 }]),
    })),
  })),
}));

afterEach(() => jest.clearAllMocks());

test('GET returns the list of books', async () => {
  const { req, res } = createMocks({ method: 'GET', query: {} });
  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  const data = JSON.parse(res._getData());
  expect(data.books).toHaveLength(1);
  expect(data.books[0].title).toBe('Book 1');
});

test('POST without an admin session is rejected with 403', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { title: 'New Book', author: 'A', description: 'D', price: 5 },
  });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(403);
});
