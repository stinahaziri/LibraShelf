import { useState } from 'react';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Favorite from '@/models/Favorite';
import Button from '@/components/Button';

export default function Dashboard({ user, reviews: initialReviews, favoritesCount }) {
  const [reviews, setReviews] = useState(initialReviews);

  const deleteReview = async (id) => {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Mirë se erdhe, {user.name}!</h1>
      <p className="mb-8 text-gray-500">Ky është paneli yt personal.</p>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Komentet e mia</p>
          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Të Preferuarat</p>
          <p className="text-2xl font-bold text-gray-900">{favoritesCount}</p>
          <Link href="/favorites" className="text-sm text-brand-600 hover:underline">
            Shiko listën →
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Roli</p>
          <p className="text-2xl font-bold capitalize text-gray-900">{user.role}</p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-900">Komentet e Mia të Fundit</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Ende s'keni lënë asnjë koment.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <Link href={`/books/${review.book?._id}`} className="font-medium text-gray-900 hover:text-brand-600">
                  {review.book?.title}
                </Link>
                <p className="text-sm text-yellow-600">{'★'.repeat(review.rating)}</p>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
              <Button variant="danger" onClick={() => deleteReview(review._id)}>
                Fshi
              </Button>
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
  const reviews = await Review.find({ user: session.user.id }).populate('book', 'title').sort({ createdAt: -1 }).lean();
  const favoritesCount = await Favorite.countDocuments({ user: session.user.id });

  return {
    props: {
      user: session.user,
      reviews: JSON.parse(JSON.stringify(reviews)),
      favoritesCount,
    },
  };
}
