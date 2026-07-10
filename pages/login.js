import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/Button';

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      setError('Email ose fjalëkalim i pasaktë');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Hyrje</h1>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email është i detyrueshëm' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fjalëkalimi</label>
          <input
            type="password"
            {...register('password', { required: 'Fjalëkalimi është i detyrueshëm' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Duke u kyçur...' : 'Hyr'}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" /> OSE <div className="h-px flex-1 bg-gray-200" />
      </div>

      <Button variant="outline" fullWidth onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        Vazhdo me Google
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600">
        S'keni llogari?{' '}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Regjistrohuni
        </Link>
      </p>
    </div>
  );
}
