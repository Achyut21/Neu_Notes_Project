// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/favorites/my-favorites');
      setFavorites(response.data);
    } catch (error) {
      setError('Failed to load favorites');
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites(prev => prev.filter(favorite => favorite.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Favorites</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">You don't have any favorites yet.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:text-accent">
            Browse Available Notes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {favorite.file_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {favorite.category_name} &gt; {favorite.subcategory_name}
                </p>
                {favorite.description && (
                  <p className="text-sm text-gray-600 mt-2">{favorite.description}</p>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <Link 
                    to={`/category/${favorite.category_id}/note/${favorite.upload_id}`}
                    className="text-primary hover:text-accent text-sm"
                  >
                    View Note
                  </Link>
                  
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;