import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/Button';

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [status, setStatus] = useState(null);
  const password = watch('password');

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: result.message });
        return;
      }

      setStatus({ type: 'success', message: 'Regjistrimi u krye! Po ju ridrejtojmë te hyrja...' });
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setStatus({ type: 'error', message: 'Nuk u arrit lidhja me serverin' });
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Regjistrohu</h1>

      {status && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Emri</label>
          <input
            {...register('name', { required: 'Emri është i detyrueshëm' })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email është i detyrueshëm',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email i pavlefshëm' },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fjalëkalimi</label>
          <input
            type="password"
            {...register('password', {
              required: 'Fjalëkalimi është i detyrueshëm',
              minLength: { value: 6, message: 'Të paktën 6 karaktere' },
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Konfirmo Fjalëkalimin</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Ju lutem konfirmoni fjalëkalimin',
              validate: (value) => value === password || 'Fjalëkalimet nuk përputhen',
            })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'Duke u regjistruar...' : 'Regjistrohu'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Keni llogari tashmë?{' '}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Hyni
        </Link>
      </p>
    </div>
  );
}
