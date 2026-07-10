import { useState } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Message from '@/models/Message';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

export default function AdminPanel({ books: initialBooks, messages }) {
  const [books, setBooks] = useState(initialBooks);
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    const res = await fetch(`/api/books/${toDelete._id}`, { method: 'DELETE' });
    if (res.ok) setBooks((prev) => prev.filter((b) => b._id !== toDelete._id));
    setToDelete(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Paneli i Administrimit</h1>
        <Link href="/admin/books/new">
          <Button>+ Libër i Ri</Button>
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Librat ({books.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Titulli</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Autori</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Çmimi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Stoku</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                  <td className="px-4 py-3 text-gray-600">{book.author}</td>
                  <td className="px-4 py-3 text-gray-600">{book.price.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-gray-600">{book.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/books/${book._id}/edit`}>
                        <Button variant="outline">Ndrysho</Button>
                      </Link>
                      <Button variant="danger" onClick={() => setToDelete(book)}>
                        Fshi
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Mesazhet e Kontaktit ({messages.length})</h2>
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg._id} className="rounded-xl border border-gray-200 p-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-900">
                  {msg.name} ({msg.email})
                </span>
                <span>{new Date(msg.createdAt).toLocaleDateString('sq-AL')}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{msg.message}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={!!toDelete}
        title="Fshi Librin"
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        confirmText="Fshi"
        danger
      >
        A jeni i sigurt që doni të fshini "{toDelete?.title}"? Ky veprim është i pakthyeshëm.
      </Modal>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return { redirect: { destination: '/', permanent: false } };
  }

  await dbConnect();
  const books = await Book.find().sort({ createdAt: -1 }).lean();
  const messages = await Message.find().sort({ createdAt: -1 }).limit(20).lean();

  return {
    props: {
      books: JSON.parse(JSON.stringify(books)),
      messages: JSON.parse(JSON.stringify(messages)),
    },
  };
}
