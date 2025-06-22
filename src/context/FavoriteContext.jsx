import React, { createContext, useState, useContext, useEffect } from 'react';
import favoriteService from '../services/favoriteService';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { token } = useAuth();

  // Busca os favoritos quando o usuário faz login
  useEffect(() => {
    if (token) {
      favoriteService.getMyFavorites()
        .then(favorites => {
          const ids = favorites.map(fav => fav.id);
          setFavoriteIds(new Set(ids));
        })
        .catch(err => console.error("Não foi possível carregar favoritos", err));
    } else {
      setFavoriteIds(new Set()); // Limpa os favoritos no logout
    }
  }, [token]);

  const toggleFavorite = async (song) => {
    if (!song) return;

    const isFavorited = favoriteIds.has(song.id);
    const updatedFavorites = new Set(favoriteIds);

    try {
      if (isFavorited) {
        await favoriteService.unlikeAudio(song.id);
        updatedFavorites.delete(song.id);
      } else {
        await favoriteService.addFavorite(song.id);
        updatedFavorites.add(song.id);
      }
      setFavoriteIds(updatedFavorites);
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar", error);
    }
  };

  const value = { favoriteIds, toggleFavorite };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = () => useContext(FavoriteContext);