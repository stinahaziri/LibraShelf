import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodë e palejuar' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere' });
  }

  try {
    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Ky email është regjistruar tashmë' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      provider: 'credentials',
    });

    return res.status(201).json({
      message: 'Regjistrimi u krye me sukses',
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gabim në server', error: error.message });
  }
}
