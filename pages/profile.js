import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Button from '@/components/Button';

export default function Profile({ profile }) {
  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: profile.name, image: profile.image } });
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setStatus(null);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus({ type: 'success', message: 'Profili u përditësua me sukses' });
      await update();
    } else {
      setStatus({ type: 'error', message: 'Përditësimi dështoi' });
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Profili Im</h1>

      {status && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.message}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-200 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-600">
          {profile.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile.email}</p>
          <p className="text-sm capitalize text-gray-500">Roli: {profile.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Emri</label>
          <input
            {...register('name', { required: true })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Foto (URL)</label>
          <input
            {...register('image')}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
        </Button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  await dbConnect();
  const user = await User.findById(session.user.id).select('-password').lean();

  return {
    props: { profile: JSON.parse(JSON.stringify(user)) },
  };
}
