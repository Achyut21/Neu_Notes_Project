// src/components/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';

const CommentsSection = ({ uploadId, initialCommentCount = 0 }) => {
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [uploadId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.get(`/comment/by-upload/${uploadId}`);
      setComments(response.data);
      setCommentCount(response.data.length);
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
      
      // Add new comment to the list
      setComments(prev => [response.data, ...prev]);
      
      // Update comment count
      setCommentCount(prev => prev + 1);
      
      setNewComment('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
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
      
      // Remove comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // Update comment count
      setCommentCount(prev => prev - 1);
      
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div id="comments" className="p-3 bg-gray-50 rounded-md">
      <h3 className="text-md font-medium text-secondary mb-2">Comments ({commentCount})</h3>
      
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent disabled:opacity-50"
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
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
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
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;