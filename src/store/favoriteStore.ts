import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SpotFavorite {
  id: string;
  name: string;
  createdAt: string;
}

interface FavoriteState {
  favorites: SpotFavorite[];
  addFavorite: (name: string) => void;
  removeFavorite: (id: string) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const exists = get().favorites.some((f) => f.name === trimmed);
        if (exists) return;
        set((state) => ({
          favorites: [
            {
              id: crypto.randomUUID(),
              name: trimmed,
              createdAt: new Date().toISOString(),
            },
            ...state.favorites,
          ],
        }));
      },
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
    }),
    {
      name: 'fishing-spot-favorites',
    },
  ),
);
