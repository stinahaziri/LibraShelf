import { useForm } from 'react-hook-form';
import Button from './Button';

const categories = ['Roman', 'Shkencë-Fiction', 'Histori', 'Biografi', 'Fëmijë', 'Poezi', 'Tjetër'];

export default function BookForm({ defaultValues, onSubmit, submitLabel = 'Ruaj' }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, price: Number(data.price), stock: Number(data.stock) }))}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Titulli</label>
        <input
          {...register('title', { required: 'Titulli është i detyrueshëm' })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Autori</label>
        <input
          {...register('author', { required: 'Autori është i detyrueshëm' })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        />
        {errors.author && <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Përshkrimi</label>
        <textarea
          rows={4}
          {...register('description', { required: 'Përshkrimi është i detyrueshëm' })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kategoria</label>
          <select {...register('category')} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Foto Kopertine (URL)</label>
          <input
            {...register('coverImage')}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Çmimi (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Çmimi është i detyrueshëm', min: 0 })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stoku</label>
          <input
            type="number"
            {...register('stock', { required: 'Stoku është i detyrueshëm', min: 0 })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Duke ruajtur...' : submitLabel}
      </Button>
    </form>
  );
}
