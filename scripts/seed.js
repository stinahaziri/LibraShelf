/**
 * Skript për të mbushur bazën e të dhënave me përdorues admin dhe libra shembull.
 * Përdorim: npm run seed
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
);

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,
    coverImage: String,
    createdBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

const sampleBooks = [
  {
    title: 'Përtej Detit',
    author: 'Ismail Kadare',
    description: 'Një roman i thellë psikologjik nga një prej autorëve më të mëdhenj shqiptarë.',
    category: 'Roman',
    price: 12.99,
    stock: 15,
    coverImage: 'https://covers.openlibrary.org/b/id/240727-L.jpg',
  },
  {
    title: 'Historia e Shqipërisë',
    author: 'Grup Autorësh',
    description: 'Përmbledhje e ngjarjeve historike kryesore të popullit shqiptar.',
    category: 'Histori',
    price: 18.5,
    stock: 8,
    coverImage: 'https://covers.openlibrary.org/b/id/8225631-L.jpg',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Klasik i shkencës-fiksion, një udhëtim epik nëpër galaktikë dhe pushtet.',
    category: 'Shkencë-Fiction',
    price: 15.0,
    stock: 20,
    coverImage: 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
  },
  {
    title: 'Biografia e Nikolla Teslës',
    author: 'Margaret Cheney',
    description: 'Jeta dhe zbulimet e njërit prej shpikësve më vizionarë të historisë.',
    category: 'Biografi',
    price: 14.25,
    stock: 10,
    coverImage: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Gabim: MONGODB_URI mungon në .env.local');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('U lidh me MongoDB...');

  const adminEmail = 'admin@librashelf.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await User.create({
      name: 'Admin LibraShelf',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Admin u krijua: ${adminEmail} / Admin123!`);
  } else {
    console.log('Admini ekziston tashmë, u anashkalua.');
  }

  const admin = await User.findOne({ email: adminEmail });

  for (const bookData of sampleBooks) {
    const exists = await Book.findOne({ title: bookData.title });
    if (!exists) {
      await Book.create({ ...bookData, createdBy: admin._id });
      console.log(`Libri u shtua: ${bookData.title}`);
    }
  }

  console.log('Seed-i përfundoi me sukses!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
