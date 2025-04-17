// src/components/FavoriteButton.jsx - Simplified version
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FavoriteButton = ({ uploadId }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favorite, setFavorite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await api.get(`/favorites/check/${uploadId}`);
        console.log("Favorite response:", response.data); // Debug log
        setIsFavorited(response.data.favorited);
        setFavorite(response.data.favorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (uploadId) {
      checkFavoriteStatus();
    }
  }, [uploadId]);

  const handleToggleFavorite = async () => {
    // Toggle state immediately for responsive UI
    setIsFavorited(!isFavorited);
    
    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        await api.delete(`/favorites/${favorite.id}`);
        setFavorite(null);
      } else {
        // Add to favorites
        const response = await api.post('/favorites', { upload_id: uploadId });
        setFavorite(response.data);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert state on error
      setIsFavorited(isFavorited);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`px-3 py-1 rounded-md ${
        isFavorited 
          ? 'bg-yellow-500 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
      }`}
    >
      {isFavorited ? '❤️ Favorited' : '🤍 Favorite'}
    </button>
  );
};

export default FavoriteButton;