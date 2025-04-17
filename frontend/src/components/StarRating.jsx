// src/components/StarRating.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StarRating = ({ uploadId }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingId, setRatingId] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Fetch user's rating and average rating in parallel
        const [userResponse, averageResponse] = await Promise.all([
          api.get(`/ratings/user/${uploadId}`),
          api.get(`/ratings/average/${uploadId}`)
        ]);
        
        if (userResponse.data.rated) {
          setUserRating(userResponse.data.rating.rating);
          setRatingId(userResponse.data.rating.id);
        }
        
        setAverageRating(averageResponse.data.average_rating);
        setRatingCount(averageResponse.data.rating_count);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    if (uploadId) {
      fetchRatings();
    }
  }, [uploadId]);

  const handleRate = async (rating) => {
    setIsLoading(true);
    try {
      const response = await api.post('/ratings', { upload_id: uploadId, rating });
      
      setUserRating(response.data.rating);
      setRatingId(response.data.id);
      
      // Refetch average rating
      const averageResponse = await api.get(`/ratings/average/${uploadId}`);
      setAverageRating(averageResponse.data.average_rating);
      setRatingCount(averageResponse.data.rating_count);
    } catch (error) {
      console.error('Error rating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!ratingId) return;
    
    setIsLoading(true);
    try {
      await api.delete(`/ratings/${ratingId}`);
      
      setUserRating(0);
      setRatingId(null);
      
      // Refetch average rating
      const averageResponse = await api.get(`/ratings/average/${uploadId}`);
      setAverageRating(averageResponse.data.average_rating);
      setRatingCount(averageResponse.data.rating_count);
    } catch (error) {
      console.error('Error removing rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={isLoading}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-yellow-400 focus:outline-none disabled:opacity-50"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                viewBox="0 0 20 20" 
                fill={star <= (hoveredRating || userRating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path 
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                />
              </svg>
            </button>
          ))}
        </div>
        
        {userRating > 0 && (
          <button
            onClick={handleRemoveRating}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            Remove rating
          </button>
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        {ratingCount > 0 ? (
          <span>
            Average: {averageRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </span>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>
    </div>
  );
};

export default StarRating;