import Image from 'next/image';
import Link from 'next/link';
import useFavorites from '@/hooks/useFavorites';
import { useSession } from 'next-auth/react';

export default function BookCard({ book }) {
  const { data: session } = useSession();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favored = isFavorite(book._id);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!session) return;
    if (favored) await removeFavorite(book._id);
    else await addFavorite(book._id);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/books/${book._id}`} className="flex flex-1 flex-col">
        <div className="relative h-56 w-full bg-gray-100">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">{book.category}</span>
          <h3 className="line-clamp-2 font-semibold text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-bold text-gray-900">{book.price.toFixed(2)} €</span>
          </div>
        </div>
      </Link>
      {session && (
        <button
          onClick={toggleFavorite}
          aria-label="Shto tek të preferuarat"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow ${
            favored ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {favored ? '♥' : '♡'}
        </button>
      )}
    </div>
  );
}
