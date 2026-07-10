import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import useFavorites from '@/hooks/useFavorites';

const navLinks = [
  { href: '/', label: 'Ballina' },
  { href: '/books', label: 'Librat' },
  { href: '/about', label: 'Rreth Nesh' },
  { href: '/contact', label: 'Kontakt' },
];

export default function Header() {
  const { data: session } = useSession();
  const { favorites } = useFavorites();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          📚 LibraShelf
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium hover:text-brand-600 ${
                router.pathname === link.href ? 'text-brand-600' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link href="/favorites" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Të preferuarat ({favorites.length})
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Profili
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Dilni
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Hyrje
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                Regjistrohu
              </Link>
            </>
          )}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Hap menunë"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/favorites" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                Të preferuarat ({favorites.length})
              </Link>
              <Link href="/dashboard" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                Profili
              </Link>
              {isAdmin && (
                <Link href="/admin" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="py-2 text-left text-sm text-gray-700">
                Dilni
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                Hyrje
              </Link>
              <Link href="/register" className="py-2 text-sm text-gray-700" onClick={() => setOpen(false)}>
                Regjistrohu
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
