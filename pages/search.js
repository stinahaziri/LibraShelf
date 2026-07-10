import { useEffect, useState } from 'react';
import BookCard from '@/components/BookCard';
import Loader from '@/components/Loader';
import useDebouncedValue from '@/hooks/useDebouncedValue';

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 400);

  useEffect(() => {
    if (!debouncedQuery) {
      setBooks([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/books?search=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBooks(data.books || []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Kërko Libra</h1>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Shkruani titullin ose autorin..."
        className="mb-8 w-full max-w-lg rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
      />

      {loading && <Loader label="Duke kërkuar..." />}

      {!loading && debouncedQuery && books.length === 0 && (
        <p className="text-gray-500">Asnjë rezultat për "{debouncedQuery}".</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}
