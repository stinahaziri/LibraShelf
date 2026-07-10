import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Duhet të kyçeni' });

  await dbConnect();
  const { id } = req.query; // id i librit

  if (req.method === 'DELETE') {
    await Favorite.findOneAndDelete({ user: session.user.id, book: id });
    return res.status(200).json({ message: 'U hoq nga të preferuarat' });
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
