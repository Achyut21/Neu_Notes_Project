// src/components/TagInput.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TagInput = ({ uploadId }) => {
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsResponse, allTagsResponse] = await Promise.all([
          api.get(`/tags/by-upload/${uploadId}`),
          api.get('/tags')
        ]);
        
        setTags(tagsResponse.data);
        setAllTags(allTagsResponse.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    if (uploadId) {
      fetchData();
    }
  }, [uploadId]);

  const handleAddTag = async () => {
    if (!selectedTag) return;
    
    setIsLoading(true);
    try {
      const tagId = parseInt(selectedTag);
      await api.post('/tags/note-tag', { upload_id: uploadId, tag_id: tagId });
      
      // Refetch tags for this note
      const response = await api.get(`/tags/by-upload/${uploadId}`);
      setTags(response.data);
      setSelectedTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (noteTagId) => {
    setIsLoading(true);
    try {
      await api.delete(`/tags/note-tag/${noteTagId}`);
      setTags(prev => prev.filter(tag => tag.note_tag_id !== noteTagId));
    } catch (error) {
      console.error('Error removing tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('/tags', { name: newTagName.trim() });
      setAllTags(prev => [...prev, response.data]);
      setSelectedTag(response.data.id.toString());
      setNewTagName('');
      setIsCreatingTag(false);
    } catch (error) {
      console.error('Error creating tag:', error);
      alert(error.response?.data?.message || 'Failed to create tag');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out tags that are already applied to this note
  const availableTags = allTags.filter(tag => 
    !tags.some(noteTag => noteTag.id === tag.id)
  );

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.length === 0 ? (
          <span className="text-sm text-gray-500 italic">No tags yet</span>
        ) : (
          tags.map((tag) => (
            <div 
              key={tag.id} 
              className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag.note_tag_id)}
                className="ml-1 text-gray-500 hover:text-gray-700"
                aria-label="Remove tag"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      
      {isCreatingTag ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleCreateTag}
            disabled={isLoading || !newTagName.trim()}
            className="px-2 py-1 bg-primary text-white rounded text-sm disabled:opacity-50"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreatingTag(false)}
            className="px-2 py-1 border text-gray-600 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
            disabled={isLoading}
          >
            <option value="">Select a tag</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleAddTag}
            disabled={isLoading || !selectedTag}
            className="px-2 py-1 bg-primary text-white rounded text-sm disabled:opacity-50"
          >
            Add
          </button>
          
          <button
            onClick={() => setIsCreatingTag(true)}
            className="px-2 py-1 border text-gray-600 rounded text-sm"
          >
            Create New
          </button>
        </div>
      )}
    </div>
  );
};

export default TagInput;