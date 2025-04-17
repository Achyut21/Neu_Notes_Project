// src/components/NoteDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';

const NoteDetails = () => {
  const { categoryId, uploadId } = useParams();
  const { user } = useAuthStore();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get the upload details
        const uploadResponse = await api.get(`/upload/${uploadId}`);
        console.log("Note data:", uploadResponse.data);
        setNote(uploadResponse.data);
        
        // Check if the user has favorited this note
        if (user) {
          try {
            const favoriteResponse = await api.get(`/favorites/check/${uploadId}`);
            setIsFavorite(favoriteResponse.data.favorited);
            setFavoriteId(favoriteResponse.data.favorite?.id);
          } catch (error) {
            console.error('Error checking favorite status:', error);
          }
          
          // Get user's current rating for this note
          try {
            const ratingResponse = await api.get(`/ratings/user/${uploadId}`);
            if (ratingResponse.data.rated) {
              setRating(ratingResponse.data.rating.rating);
            }
          } catch (error) {
            console.error('Error fetching rating:', error);
          }
        }
        
        // Fetch comments for this upload
        try {
          const commentsResponse = await api.get(`/comment/by-upload/${uploadId}`);
          setComments(commentsResponse.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
        
        // Fetch tags for this note
        try {
          const tagsResponse = await api.get(`/tags/by-upload/${uploadId}`);
          setTags(tagsResponse.data);
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
        
        // Fetch all available tags
        try {
          const allTagsResponse = await api.get('/tags');
          setAllTags(allTagsResponse.data);
        } catch (error) {
          console.error('Error fetching all tags:', error);
        }
        
      } catch (error) {
        console.error('Error fetching note details:', error);
        setError('Failed to load note details');
      } finally {
        setIsLoading(false);
      }
    };

    if (uploadId) {
      fetchData();
    }
  }, [uploadId, user]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await api.delete(`/favorites/${favoriteId}`);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const response = await api.post('/favorites', { upload_id: uploadId });
        setIsFavorite(true);
        setFavoriteId(response.data.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRateNote = async (newRating) => {
    if (!user) return;
    
    try {
      await api.post('/ratings', { upload_id: uploadId, rating: newRating });
      setRating(newRating);
    } catch (error) {
      console.error('Error rating note:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/comment', {
        upload_id: uploadId,
        content: newComment
      });
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    
    try {
      await api.delete(`/comment/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddTag = async () => {
    if (!selectedTag || !user) return;
    
    try {
      await api.post('/tags/note-tag', {
        upload_id: uploadId,
        tag_id: parseInt(selectedTag)
      });
      
      // Refetch tags
      const tagsResponse = await api.get(`/tags/by-upload/${uploadId}`);
      setTags(tagsResponse.data);
      setSelectedTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !user) return;
    
    try {
      // First create the tag
      const createResponse = await api.post('/tags', {
        name: newTagName.trim()
      });
      
      // Then add it to the note
      await api.post('/tags/note-tag', {
        upload_id: uploadId,
        tag_id: createResponse.data.id
      });
      
      // Refetch tags
      const tagsResponse = await api.get(`/tags/by-upload/${uploadId}`);
      setTags(tagsResponse.data);
      
      // Update all tags list
      const allTagsResponse = await api.get('/tags');
      setAllTags(allTagsResponse.data);
      
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleRemoveTag = async (noteTagId) => {
    if (!user) return;
    
    try {
      await api.delete(`/tags/note-tag/${noteTagId}`);
      setTags(prev => prev.filter(tag => tag.note_tag_id !== noteTagId));
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Note not found'}
        </div>
        <Link to={`/category/${categoryId}`} className="mt-4 inline-block text-primary hover:text-accent">
          &larr; Back to Category
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Note Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary">{note.file_name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded by: {note.first_name} {note.last_name} on {new Date(note.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            
            {user && (
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                {/* Favorite Button */}
                <button
                  onClick={handleToggleFavorite}
                  className={`px-3 py-1 rounded-md ${
                    isFavorite 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                  }`}
                >
                  {isFavorite ? '❤️ Favorited' : '🤍 Favorite'}
                </button>
                
                {/* Download Button */}
                <a
                  href={note.file_url}
                  download
                  className="px-3 py-1 bg-primary text-white rounded-md hover:bg-accent"
                >
                  Download
                </a>
              </div>
            )}
          </div>
          
          {/* Description Section */}
          {note.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h2 className="text-md font-medium text-secondary">Description</h2>
              <p className="mt-1 text-gray-600">{note.description}</p>
            </div>
          )}
          
          {/* Note Statistics Section (replacing the preview) */}
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-secondary mb-4">Note Analytics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Key Metrics */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {note.rating_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Ratings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">
                      {comments.length}
                    </div>
                    <div className="text-xs text-gray-500">Comments</div>
                  </div>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Snapshot</h4>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    {note.average_rating ? (
                      <>
                        <div className="text-4xl font-bold text-yellow-500">
                          {Number(note.average_rating).toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-lg">
                              <span className={star <= Math.round(note.average_rating) ? 'text-yellow-500' : 'text-gray-300'}>
                                ★
                              </span>
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {note.rating_count} {note.rating_count === 1 ? 'rating' : 'ratings'}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">No ratings yet</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Recent Activity Timeline */}
              <div className="bg-white p-4 rounded-md shadow-sm col-span-1 sm:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {comments.length > 0 ? (
                    comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                          {comment.first_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {comment.first_name} {comment.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {comment.content.length > 100 ? 
                              `${comment.content.substring(0, 100)}...` : 
                              comment.content
                            }
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No recent activity
                    </div>
                  )}
                  
                  {comments.length > 3 && (
                    <div className="text-center text-sm mt-2">
                      <a href="#comments" className="text-primary hover:text-accent">
                        View all {comments.length} comments
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-secondary">Rating</h3>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRateNote(star)}
                    className="focus:outline-none"
                    disabled={!user}
                  >
                    <span className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {note.average_rating ? `Average: ${parseFloat(note.average_rating).toFixed(1)} (${note.rating_count} ratings)` : 'No ratings yet'}
              </span>
            </div>
            {!user && (
              <p className="text-xs text-gray-500 mt-1">Sign in to rate this note</p>
            )}
          </div>
          
          {/* Tags Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-secondary">Tags</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags && tags.length > 0 ? (
                tags.map(tag => (
                  <div key={tag.id} className="flex items-center bg-gray-200 px-2 py-1 rounded-md">
                    <span className="text-sm text-gray-700">{tag.name}</span>
                    {user && (
                      <button 
                        onClick={() => handleRemoveTag(tag.note_tag_id)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-500">No tags yet</span>
              )}
            </div>
            
            {/* Add tag UI */}
            {user && (
              <div className="mt-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <select 
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    <option value="">Select a tag</option>
                    {allTags.filter(tag => 
                      !tags.some(t => t.id === tag.id)
                    ).map(tag => (
                      <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddTag}
                    disabled={!selectedTag}
                    className="px-2 py-1 bg-primary text-white rounded-md text-sm disabled:opacity-50"
                    type="button"
                  >
                    Add
                  </button>
                  <span className="text-gray-500">or</span>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Create new tag"
                    className="px-2 py-1 border rounded-md text-sm"
                  />
                  <button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    className="px-2 py-1 bg-primary text-white rounded-md text-sm disabled:opacity-50"
                    type="button"
                  >
                    Create & Add
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div id="comments" className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-md font-medium text-secondary mb-2">Comments ({comments.length})</h3>
            
            {/* Add new comment form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="mb-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <p className="mb-4 text-sm text-gray-500">Please sign in to post comments.</p>
            )}
            
            {/* Comments list */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {comment.first_name} {comment.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      {user && (user.id === comment.user_id || user.role === 'ADMIN') && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          type="button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to={`/category/${categoryId}`} className="text-primary hover:text-accent">
          &larr; Back to Category
        </Link>
      </div>
    </div>
  );
};

export default NoteDetails;