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
        
        // These values now come directly from the upload table via triggers
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
      // Call API to add/update rating - triggers will handle statistics
      const response = await api.post('/ratings', { upload_id: uploadId, rating });
      
      // Update user's current rating
      setUserRating(rating);
      setRatingId(response.data.id);
      
      // Fetch the updated average (maintained by triggers)
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
      
      // Reset user rating
      setUserRating(0);
      setRatingId(null);
      
      // Fetch the updated average (maintained by triggers)
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
              <span className={`text-2xl ${star <= (hoveredRating || userRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
              </span>
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
            Average: {parseFloat(averageRating).toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
          </span>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>
    </div>
  );
};

export default StarRating;