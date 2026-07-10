import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { bookId } = req.query;
    const query = bookId ? { book: bookId } : {};
    const reviews = await Review.find(query).populate('user', 'name image').sort({ createdAt: -1 }).lean();
    return res.status(200).json({ reviews });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: 'Duhet të kyçeni për të lënë koment' });

    const { bookId, rating, comment } = req.body;
    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'Fushat e detyrueshme mungojnë' });
    }

    const review = await Review.create({
      book: bookId,
      user: session.user.id,
      rating,
      comment,
    });
    const populated = await review.populate('user', 'name image');
    return res.status(201).json({ review: populated });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
