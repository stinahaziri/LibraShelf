import { SessionProvider } from 'next-auth/react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <FavoritesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FavoritesProvider>
    </SessionProvider>
  );
}
