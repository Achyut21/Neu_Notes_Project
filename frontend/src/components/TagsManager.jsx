// src/components/TagsManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TagsManager = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      setError('Failed to load tags');
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.post('/tags', { name: newTagName.trim() });
      
      setTags(prev => [...prev, response.data]);
      setNewTagName('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create tag');
      console.error('Error creating tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && tags.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Tags</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleCreateTag} className="mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="px-3 py-2 border rounded flex-grow"
            required
          />
          
          <button
            type="submit"
            disabled={isLoading || !newTagName.trim()}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Create Tag
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">All Tags</h3>
        
        {tags.length === 0 ? (
          <p className="text-gray-500 italic">No tags created yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div 
                key={tag.id} 
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded"
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsManager;