import { createContext, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const FavoritesContext = createContext({
  favorites: [],
  loading: false,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (status !== 'authenticated') {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = async (bookId) => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId }),
    });
    if (res.ok) await loadFavorites();
    return res.ok;
  };

  const removeFavorite = async (bookId) => {
    const res = await fetch(`/api/favorites/${bookId}`, { method: 'DELETE' });
    if (res.ok) await loadFavorites();
    return res.ok;
  };

  const isFavorite = (bookId) => favorites.some((f) => f.book?._id === bookId || f.book === bookId);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorite, reload: loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}
