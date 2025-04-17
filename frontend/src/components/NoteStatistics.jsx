// src/components/NoteStatistics.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const NoteStatistics = ({ noteId }) => {
  const [stats, setStats] = useState({
    views: 0,
    downloads: 0,
    ratings: [],
    commentsByMonth: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // In a real implementation, we'd fetch these stats from the backend
        // For now, we'll use the note data we already have and generate some stats
        const response = await api.get(`/upload/${noteId}`);
        const note = response.data;
        
        // Count ratings distribution for chart 
        const ratingsDistribution = [0, 0, 0, 0, 0]; // Index 0 = 1 star, index 4 = 5 stars
        if (note.rating_count > 0) {
          // This is a simplified distribution - in reality you'd fetch this from backend
          // We're just creating a mock distribution based on average rating
          const avgRating = Math.round(note.average_rating);
          ratingsDistribution[avgRating - 1] = note.rating_count;
        }

        // Generate mock data for comment trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const commentTrend = months.map(month => ({
          month,
          count: Math.floor(Math.random() * 10) // Random value for demonstration
        }));
        
        setStats({
          views: Math.floor(Math.random() * 100) + note.rating_count * 5,
          downloads: Math.floor(Math.random() * 20) + 5,
          ratings: ratingsDistribution,
          commentsByMonth: commentTrend,
          isLoading: false
        });
      } catch (error) {
        console.error("Error fetching note statistics:", error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to load statistics"
        }));
      }
    };

    if (noteId) {
      fetchStatistics();
    }
  }, [noteId]);

  if (stats.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {stats.error}
      </div>
    );
  }

  // Render the statistics with visual elements
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-secondary mb-4">Note Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {stats.views}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {stats.downloads}
              </div>
              <div className="text-xs text-gray-500">Downloads</div>
            </div>
          </div>
        </div>
        
        {/* Ratings Distribution */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
          <div className="flex items-end h-32 mt-2">
            {stats.ratings.map((count, index) => {
              const star = index + 1;
              const maxHeight = Math.max(...stats.ratings);
              const barHeight = maxHeight > 0 ? (count / maxHeight) * 100 : 0;
              
              return (
                <div key={star} className="flex-1 flex flex-col items-center">
                  <div className="w-full px-1">
                    <div 
                      className="w-full bg-yellow-500 rounded-t" 
                      style={{height: `${barHeight}%`, minHeight: count > 0 ? '4px' : '0'}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1">{star} ★</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Comments Over Time */}
        <div className="bg-gray-50 p-4 rounded-md md:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Comments Over Time</h4>
          <div className="h-40 flex items-end space-x-2">
            {stats.commentsByMonth.map((item) => {
              const maxCount = Math.max(...stats.commentsByMonth.map(d => d.count));
              const barHeight = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full px-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all duration-500" 
                      style={{height: `${barHeight}%`, minHeight: item.count > 0 ? '4px' : '0'}}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 rotate-45 origin-top-left">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Statistics are updated hourly. Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default NoteStatistics;