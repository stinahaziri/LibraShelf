import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Duhet të kyçeni' });

  await dbConnect();

  if (req.method === 'GET') {
    const favorites = await Favorite.find({ user: session.user.id }).populate('book').sort({ createdAt: -1 }).lean();
    return res.status(200).json({ favorites });
  }

  if (req.method === 'POST') {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId mungon' });

    try {
      const favorite = await Favorite.create({ user: session.user.id, book: bookId });
      return res.status(201).json({ favorite });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(200).json({ message: 'Tashmë është në të preferuarat' });
      }
      return res.status(500).json({ message: 'Gabim në server' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
