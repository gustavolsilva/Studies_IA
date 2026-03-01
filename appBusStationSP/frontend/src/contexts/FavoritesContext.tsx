import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Route, Station } from '../types';

interface FavoritesContextType {
  favoriteRoutes: Route[];
  favoriteStations: Station[];
  searchHistory: string[];
  addFavoriteRoute: (route: Route) => void;
  removeFavoriteRoute: (id: string) => void;
  isFavoriteRoute: (id: string) => boolean;
  addFavoriteStation: (station: Station) => void;
  removeFavoriteStation: (id: string) => void;
  isFavoriteStation: (id: string) => boolean;
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteRoutes, setFavoriteRoutes] = useLocalStorage<Route[]>('favoriteRoutes', []);
  const [favoriteStations, setFavoriteStations] = useLocalStorage<Station[]>('favoriteStations', []);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);

  // Routes
  const addFavoriteRoute = (route: Route) => {
    setFavoriteRoutes((prev) => {
      if (prev.some((r) => r.id === route.id)) return prev;
      return [route, ...prev];
    });
  };

  const removeFavoriteRoute = (id: string) => {
    setFavoriteRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const isFavoriteRoute = (id: string) => {
    return favoriteRoutes.some((r) => r.id === id);
  };

  // Stations
  const addFavoriteStation = (station: Station) => {
    setFavoriteStations((prev) => {
      if (prev.some((s) => s.id === station.id)) return prev;
      return [station, ...prev];
    });
  };

  const removeFavoriteStation = (id: string) => {
    setFavoriteStations((prev) => prev.filter((s) => s.id !== id));
  };

  const isFavoriteStation = (id: string) => {
    return favoriteStations.some((s) => s.id === id);
  };

  // Search history
  const addToSearchHistory = (term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 10); // Keep only last 10
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const value = {
    favoriteRoutes,
    favoriteStations,
    searchHistory,
    addFavoriteRoute,
    removeFavoriteRoute,
    isFavoriteRoute,
    addFavoriteStation,
    removeFavoriteStation,
    isFavoriteStation,
    addToSearchHistory,
    clearSearchHistory,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
