import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Duhet të kyçeni' });

  await dbConnect();

  if (req.method === 'GET') {
    const user = await User.findById(session.user.id).select('-password').lean();
    return res.status(200).json({ user });
  }

  if (req.method === 'PUT') {
    const { name, image } = req.body;
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { ...(name && { name }), ...(image !== undefined && { image }) },
      { new: true }
    ).select('-password');
    return res.status(200).json({ user });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
