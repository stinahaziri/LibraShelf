import { useMemo, useState } from 'react';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import BookCard from '@/components/BookCard';

const categories = ['Të gjitha', 'Roman', 'Shkencë-Fiction', 'Histori', 'Biografi', 'Fëmijë', 'Poezi', 'Tjetër'];

export default function Books({ books }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Të gjitha');

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'Të gjitha' || book.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Katalogu i Librave</h1>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko sipas titullit ose autorit..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Asnjë libër nuk u gjet për kriteret e zgjedhura.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  await dbConnect();
  const books = await Book.find().sort({ createdAt: -1 }).lean();

  return {
    props: { books: JSON.parse(JSON.stringify(books)) },
    revalidate: 30, // ISR
  };
}
