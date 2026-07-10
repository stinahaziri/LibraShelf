import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Metodë e palejuar' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Emri, email dhe mesazhi janë të detyrueshëm' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email i pavlefshëm' });
  }

  try {
    await dbConnect();
    await Message.create({ name, email, subject, message });
    return res.status(201).json({ message: 'Mesazhi u dërgua me sukses. Ju falenderojmë!' });
  } catch (error) {
    return res.status(500).json({ message: 'Gabim në server', error: error.message });
  }
}
