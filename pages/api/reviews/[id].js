import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Duhet të kyçeni' });

  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: 'Komenti nuk u gjet' });

  const isOwner = review.user.toString() === session.user.id;
  const isAdmin = session.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Nuk keni leje për këtë veprim' });
  }

  if (req.method === 'PUT') {
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
    return res.status(200).json({ review });
  }

  if (req.method === 'DELETE') {
    await review.deleteOne();
    return res.status(200).json({ message: 'Komenti u fshi' });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
