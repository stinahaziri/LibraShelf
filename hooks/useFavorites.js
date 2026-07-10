import { useContext } from 'react';
import { FavoritesContext } from '@/context/FavoritesContext';

export default function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites duhet të përdoret brenda FavoritesProvider');
  }
  return context;
}
