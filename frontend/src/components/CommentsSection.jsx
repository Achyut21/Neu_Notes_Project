// src/components/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';

const CommentsSection = ({ isOpen, onClose, uploadId, fileName }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && uploadId) {
      fetchComments();
    }
  }, [isOpen, uploadId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.get(`/comment/by-upload/${uploadId}`);
      setComments(response.data);
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    if (!user) {
      setError('Please log in to post comments');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await api.post('/comment', {
        upload_id: uploadId,
        content: newComment
      });
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      setError('Failed to post comment');
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await api.delete(`/comment/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary">
            Comments for: {fileName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-4">
            <div className="mb-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-primary text-white hover:bg-accent rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
            Please log in to post comments
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Comments List */}
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{comment.first_name} {comment.last_name}</div>
                    <div className="text-xs text-gray-500">{formatDate(comment.created_at)}</div>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                  {user && (user.id === comment.user_id || user.role === 'ADMIN') && (
                    <div className="mt-1 flex justify-end">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;