import { useState } from 'react';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import BookForm from '@/components/BookForm';

export default function NewBook() {
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.message || 'Gabim gjatë ruajtjes');
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Shto Libër të Ri</h1>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <BookForm
        defaultValues={{ title: '', author: '', description: '', category: 'Roman', price: 0, stock: 0, coverImage: '' }}
        onSubmit={onSubmit}
        submitLabel="Shto Librin"
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
}
