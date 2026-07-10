import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Review from '@/models/Review';
import Button from '@/components/Button';
import useFavorites from '@/hooks/useFavorites';

export default function BookDetails({ book }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [reviews, setReviews] = useState(book.reviews);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (router.isFallback) {
    return <p className="text-center text-gray-500">Duke ngarkuar...</p>;
  }

  const favored = isFavorite(book._id);
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const onSubmitReview = async (data) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: book._id, rating: Number(data.rating), comment: data.comment }),
    });
    if (res.ok) {
      const result = await res.json();
      setReviews((prev) => [result.review, ...prev]);
      reset();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
      <div className="relative h-96 w-full overflow-hidden rounded-xl bg-gray-100 md:col-span-1">
        <Image src={book.coverImage} alt={book.title} fill sizes="33vw" className="object-cover" />
      </div>

      <div className="md:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{book.category}</span>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{book.title}</h1>
        <p className="mt-1 text-gray-500">nga {book.author}</p>
        {avgRating && (
          <p className="mt-2 text-sm text-yellow-600">
            ★ {avgRating} ({reviews.length} vlerësime)
          </p>
        )}
        <p className="mt-4 text-gray-700">{book.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <span className="text-2xl font-bold text-gray-900">{book.price.toFixed(2)} €</span>
          <span className="text-sm text-gray-500">Stoku: {book.stock}</span>
        </div>

        {session && (
          <Button
            className="mt-4"
            variant={favored ? 'danger' : 'primary'}
            onClick={() => (favored ? removeFavorite(book._id) : addFavorite(book._id))}
          >
            {favored ? 'Hiq nga të Preferuarat' : 'Shto tek të Preferuarat'}
          </Button>
        )}
      </div>

      <div className="md:col-span-3">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Komente & Vlerësime</h2>

        {session ? (
          <form onSubmit={handleSubmit(onSubmitReview)} className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Vlerësimi:</label>
              <select {...register('rating', { required: true })} className="rounded-lg border border-gray-300 px-2 py-1">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Shkruani komentin tuaj..."
              {...register('comment', { required: 'Komenti është i detyrueshëm' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
            />
            {errors.comment && <p className="text-xs text-red-600">{errors.comment.message}</p>}
            <Button type="submit" disabled={isSubmitting} className="self-start">
              Posto Komentin
            </Button>
          </form>
        ) : (
          <p className="mb-6 text-sm text-gray-500">Duhet të kyçeni për të lënë koment.</p>
        )}

        <div className="flex flex-col gap-4">
          {reviews.length === 0 && <p className="text-gray-500">Ende s'ka komente. Bëhuni i pari!</p>}
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-gray-900">{r.user?.name || 'Përdorues'}</span>
                <span className="text-sm text-yellow-600">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  await dbConnect();
  const books = await Book.find().select('_id').lean();

  return {
    paths: books.map((book) => ({ params: { id: book._id.toString() } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  const book = await Book.findById(params.id).lean();

  if (!book) {
    return { notFound: true };
  }

  const reviews = await Review.find({ book: params.id }).populate('user', 'name image').sort({ createdAt: -1 }).lean();

  return {
    props: {
      book: JSON.parse(JSON.stringify({ ...book, reviews })),
    },
    revalidate: 30, // ISR
  };
}
