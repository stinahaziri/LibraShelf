import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Review from '@/models/Review';
import Favorite from '@/models/Favorite';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    const book = await Book.findById(id).lean();
    if (!book) return res.status(404).json({ message: 'Libri nuk u gjet' });
    return res.status(200).json({ book });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Vetëm adminët mund të ndryshojnë librat' });
  }

  if (req.method === 'PUT') {
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Libri nuk u gjet' });
    return res.status(200).json({ book });
  }

  if (req.method === 'DELETE') {
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Libri nuk u gjet' });
    await Review.deleteMany({ book: id });
    await Favorite.deleteMany({ book: id });
    return res.status(200).json({ message: 'Libri u fshi me sukses' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
