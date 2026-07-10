import Link from 'next/link';
import Button from '@/components/Button';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-6xl">📕</p>
      <h1 className="text-3xl font-bold text-gray-900">404 – Faqja nuk u gjet</h1>
      <p className="max-w-md text-gray-500">
        Duket sikur libri që kërkoni është zhdukur nga rafti. Kthehuni në ballinë ose shfletoni katalogun.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button>Kthehu në Ballinë</Button>
        </Link>
        <Link href="/books">
          <Button variant="outline">Shfleto Librat</Button>
        </Link>
      </div>
    </div>
  );
}
