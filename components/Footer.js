import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h4 className="mb-2 text-lg font-bold text-brand-600">📚 LibraShelf</h4>
          <p className="text-sm text-gray-500">
            Projekt universitar për lëndën Zhvillim i Ueb-it në Anën e Klientit — një librari online e ndërtuar me Next.js.
          </p>
        </div>
        <div>
          <h5 className="mb-2 font-semibold text-gray-800">Lidhje</h5>
          <ul className="space-y-1 text-sm text-gray-500">
            <li><Link href="/books" className="hover:text-brand-600">Librat</Link></li>
            <li><Link href="/faq" className="hover:text-brand-600">Pyetje të Shpeshta</Link></li>
            <li><Link href="/terms" className="hover:text-brand-600">Kushtet e Përdorimit</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-2 font-semibold text-gray-800">Kontakt</h5>
          <ul className="space-y-1 text-sm text-gray-500">
            <li><Link href="/contact" className="hover:text-brand-600">Na kontaktoni</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">Rreth Grupit</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} LibraShelf. Të gjitha të drejtat e rezervuara.
      </p>
    </footer>
  );
}
