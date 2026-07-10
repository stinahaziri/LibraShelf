import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: result.message || 'Diçka shkoi keq' });
        return;
      }

      setStatus({ type: 'success', message: result.message });
      reset();
    } catch {
      setStatus({ type: 'error', message: 'Nuk u arrit lidhja me serverin' });
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Na Kontaktoni</h1>
      <p className="mb-6 text-gray-600">Keni pyetje apo sugjerime? Plotësoni formularin më poshtë.</p>

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
            {...register('name', { required: 'Emri është i detyrueshëm', minLength: { value: 2, message: 'Emri duhet të ketë të paktën 2 karaktere' } })}
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Subjekti (opsional)</label>
          <input
            {...register('subject')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mesazhi</label>
          <textarea
            rows={5}
            {...register('message', { required: 'Mesazhi është i detyrueshëm', minLength: { value: 10, message: 'Mesazhi duhet të ketë të paktën 10 karaktere' } })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Duke dërguar...' : 'Dërgo Mesazhin'}
        </Button>
      </form>
    </div>
  );
}
