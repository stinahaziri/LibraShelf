import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { search = '', category = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;

    const books = await Book.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ books });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Vetëm adminët mund të shtojnë libra' });
    }

    const { title, author, description, category, price, stock, coverImage } = req.body;
    if (!title || !author || !description || price === undefined) {
      return res.status(400).json({ message: 'Fushat e detyrueshme mungojnë' });
    }

    const book = await Book.create({
      title,
      author,
      description,
      category,
      price,
      stock,
      coverImage: coverImage || undefined,
      createdBy: session.user.id,
    });

    return res.status(201).json({ book });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Metodë e palejuar' });
}
