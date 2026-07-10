import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import Button from '@/components/Button';

export default function Favorites({ favorites: initialFavorites }) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const remove = async (bookId) => {
    const res = await fetch(`/api/favorites/${bookId}`, { method: 'DELETE' });
    if (res.ok) setFavorites((prev) => prev.filter((f) => f.book?._id !== bookId));
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Të Preferuarat e Mia</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">
          S'keni ende libra të preferuar.{' '}
          <Link href="/books" className="text-brand-600 hover:underline">
            Shfletoni katalogun
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav._id} className="flex gap-4 rounded-xl border border-gray-200 p-4">
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={fav.book.coverImage} alt={fav.book.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/books/${fav.book._id}`} className="font-semibold text-gray-900 hover:text-brand-600">
                    {fav.book.title}
                  </Link>
                  <p className="text-sm text-gray-500">{fav.book.author}</p>
                </div>
                <Button variant="danger" onClick={() => remove(fav.book._id)}>
                  Hiq
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  await dbConnect();
  const favorites = await Favorite.find({ user: session.user.id }).populate('book').sort({ createdAt: -1 }).lean();

  return {
    props: { favorites: JSON.parse(JSON.stringify(favorites)) },
  };
}
