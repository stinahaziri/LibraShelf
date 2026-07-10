import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import BookCard from '@/components/BookCard';
import Button from '@/components/Button';

export default function Home({ featuredBooks }) {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-8 md:grid-cols-2 md:p-14">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
            Gjeni librin e radhës që do t'ju pëlqejë 📖
          </h1>
          <p className="text-gray-600">
            LibraShelf është librari online ku mund të shfletoni, komentoni dhe ruani librat tuaj të preferuar. Projekt
            universitar për lëndën Zhvillim i Ueb-it në Anën e Klientit.
          </p>
          <div className="flex gap-3">
            <Link href="/books">
              <Button>Shfleto Librat</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Regjistrohu</Button>
            </Link>
          </div>
        </div>
        <div className="hidden justify-self-end text-[120px] md:block">📚</div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Librat e Fundit</h2>
          <Link href="/books" className="text-sm font-medium text-brand-600 hover:underline">
            Shiko të gjitha →
          </Link>
        </div>

        {featuredBooks.length === 0 ? (
          <p className="text-gray-500">Ende s'ka libra. Kthehuni së shpejti!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export async function getStaticProps() {
  await dbConnect();
  const books = await Book.find().sort({ createdAt: -1 }).limit(8).lean();

  return {
    props: {
      featuredBooks: JSON.parse(JSON.stringify(books)),
    },
    revalidate: 60, // ISR: rigjenerohet çdo 60 sekonda
  };
}
