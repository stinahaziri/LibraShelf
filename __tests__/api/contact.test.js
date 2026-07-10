import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/contact';
import Message from '@/models/Message';

jest.mock('@/lib/mongodb', () => jest.fn().mockResolvedValue(true));
jest.mock('@/models/Message', () => ({ create: jest.fn().mockResolvedValue({}) }));

afterEach(() => jest.clearAllMocks());

test('returns 400 when required fields are missing', async () => {
  const { req, res } = createMocks({ method: 'POST', body: { name: '', email: '', message: '' } });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(400);
});

test('saves the message and returns 201 when valid', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { name: 'Test User', email: 'test@example.com', message: 'Hello there, this is a test message.' },
  });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(201);
  expect(Message.create).toHaveBeenCalledTimes(1);
});
