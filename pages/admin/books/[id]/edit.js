import { useState } from 'react';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import BookForm from '@/components/BookForm';

export default function EditBook({ book }) {
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    const res = await fetch(`/api/books/${book._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.message || 'Gabim gjatë përditësimit');
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Ndrysho Librin</h1>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <BookForm defaultValues={book} onSubmit={onSubmit} submitLabel="Ruaj Ndryshimet" />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return { redirect: { destination: '/', permanent: false } };
  }

  await dbConnect();
  const book = await Book.findById(context.params.id).lean();
  if (!book) {
    return { notFound: true };
  }

  return { props: { book: JSON.parse(JSON.stringify(book)) } };
}
