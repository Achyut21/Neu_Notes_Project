// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';
import CreateSubcategoryModal from '../components/CreateSubcategoryModal';
import UploadNoteModal from '../components/UploadNoteModal';

const CategoryPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [uploads, setUploads] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubcatModal, setShowSubcatModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollButtonDisabled, setEnrollButtonDisabled] = useState(false);
  const [favorites, setFavorites] = useState({});

  // Check if user can create subcategories
  const canCreateSubcategory = user && (
    user.role === 'ADMIN' || 
    (user.role === 'FACULTY' && category?.created_by === user.id)
  );
  
  // Check if user can upload notes
  const canUpload = user && (
    user.role === 'ADMIN' || 
    user.role === 'FACULTY' || 
    (user.role === 'STUDENT' && isEnrolled)
  );

  useEffect(() => {
    fetchCategoryData();
    if (user) {
      fetchFavorites();
    }
  }, [id, user]);

  const fetchFavorites = async () => {
    try {
      // Create a simple endpoint that returns user's favorite upload IDs
      const response = await api.get('/favorites/my-favorite-ids');
      const favoriteIds = {};
      response.data.forEach(item => {
        favoriteIds[item.upload_id] = item.id;
      });
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch category details
      const categoryResponse = await api.get(`/category/${id}`);
      setCategory(categoryResponse.data);
      
      // Fetch subcategories
      const subcategoriesResponse = await api.get(`/subcategory/by-category/${id}`);
      setSubcategories(subcategoriesResponse.data);
      
      // Check if user is enrolled (only for students)
      if (user) {
        if (user.role === 'STUDENT') {
          try {
            const enrollmentResponse = await api.get(`/enrollment/check/${id}`);
            setIsEnrolled(enrollmentResponse.data.enrolled);
          } catch (error) {
            setIsEnrolled(false);
          }
        } else {
          // Admin and Faculty are automatically considered "enrolled"
          setIsEnrolled(true);
        }
      }
      
      // Initialize uploads object
      const uploadsObj = {};
      
      // Fetch uploads for each subcategory
      for (const subcategory of subcategoriesResponse.data) {
        try {
          const uploadsResponse = await api.get(`/upload/by-subcategory/${subcategory.id}`);
          uploadsObj[subcategory.id] = uploadsResponse.data;
        } catch (error) {
          console.error(`Error fetching uploads for subcategory ${subcategory.id}:`, error);
          uploadsObj[subcategory.id] = [];
        }
      }
      
      setUploads(uploadsObj);
      
    } catch (error) {
      setError('Failed to load category data');
      console.error('Error fetching category data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) return;
    
    try {
      setEnrollButtonDisabled(true);
      await api.post('/enrollment', { category_id: id });
      setIsEnrolled(true);
      alert('Enrolled successfully!');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll');
    } finally {
      setEnrollButtonDisabled(false);
    }
  };

  const handleAddSubcategory = (newSubcategory) => {
    setSubcategories(prev => [...prev, newSubcategory]);
    // Initialize uploads for new subcategory
    setUploads(prev => ({
      ...prev,
      [newSubcategory.id]: []
    }));
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory? All notes within it will be deleted.')) {
      try {
        await api.delete(`/subcategory/${subcategoryId}`);
        setSubcategories(prev => prev.filter(s => s.id !== subcategoryId));
        // Remove uploads for deleted subcategory
        const updatedUploads = { ...uploads };
        delete updatedUploads[subcategoryId];
        setUploads(updatedUploads);
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
      }
    }
  };

  const handleUploadNote = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setShowUploadModal(true);
  };

  const handleUploadSuccess = (newUpload) => {
    // Add the new upload to the corresponding subcategory
    setUploads(prev => ({
      ...prev,
      [selectedSubcategory]: [...(prev[selectedSubcategory] || []), newUpload]
    }));
  };

  const handleDeleteUpload = async (uploadId, subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      try {
        await api.delete(`/upload/${uploadId}`);
        setUploads(prev => ({
          ...prev,
          [subcategoryId]: prev[subcategoryId].filter(u => u.id !== uploadId)
        }));
      } catch (error) {
        console.error('Error deleting upload:', error);
        alert('Failed to delete upload');
      }
    }
  };

  const handleToggleFavorite = async (uploadId, subcategoryId) => {
    if (!user) return;
    
    try {
      // Update UI optimistically
      const newFavorites = { ...favorites };
      
      if (newFavorites[uploadId]) {
        // Remove from favorites
        await api.delete(`/favorites/${newFavorites[uploadId]}`);
        delete newFavorites[uploadId];
      } else {
        // Add to favorites
        const response = await api.post('/favorites', { upload_id: uploadId });
        newFavorites[uploadId] = response.data.id;
      }
      
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert UI changes on error by refetching
      fetchFavorites();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3a3a]"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Category not found'}
        </div>
        <Link to="/" className="mt-4 inline-block text-[#ff3a3a] hover:text-[#ff6b6b]">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Category Header */}
      <div className="bg-[#212121] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="mt-1 text-lg text-gray-300">Code: {category.code}</p>
              <p className="text-sm text-gray-300">
                Created by: {category.first_name} {category.last_name}
              </p>
            </div>
            
            {user && user.role === 'STUDENT' && !isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrollButtonDisabled}
                className="bg-[#ff3a3a] text-white px-4 py-2 rounded-md hover:bg-[#ff6b6b] transition-colors disabled:opacity-50 mt-4 md:mt-0"
              >
                {enrollButtonDisabled ? 'Enrolling...' : 'Enroll in this Course'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Notice for Students */}
      {user && user.role === 'STUDENT' && isEnrolled && (
        <div className="bg-green-100 text-green-700 p-4 max-w-7xl mx-auto my-4 rounded-md">
          <p className="text-center">You are enrolled in this course</p>
        </div>
      )}

      {/* Not Enrolled Warning for Students */}
      {user && user.role === 'STUDENT' && !isEnrolled && (
        <div className="bg-yellow-100 text-yellow-700 p-4 max-w-7xl mx-auto my-4 rounded-md">
          <p className="text-center">Enroll in this course to upload notes</p>
        </div>
      )}

      {/* Subcategories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#212121]">Subcategories</h2>
          
          {canCreateSubcategory && (
            <button
              onClick={() => setShowSubcatModal(true)}
              className="bg-[#ff3a3a] text-white px-4 py-2 rounded-md hover:bg-[#ff6b6b] transition-colors"
            >
              Add Subcategory
            </button>
          )}
        </div>

        {subcategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No subcategories found</p>
            {canCreateSubcategory && (
              <button
                onClick={() => setShowSubcatModal(true)}
                className="mt-4 bg-[#ff3a3a] text-white px-4 py-2 rounded-md hover:bg-[#ff6b6b] transition-colors"
              >
                Create Your First Subcategory
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#212121]">{subcategory.name}</h3>
                    <p className="text-xs text-gray-500">
                      Created by: {subcategory.first_name} {subcategory.last_name}
                      {user && subcategory.created_by === user.id && <span className="ml-1 text-[#ff3a3a]">(You)</span>}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {canUpload && (
                      <button
                        onClick={() => handleUploadNote(subcategory.id)}
                        className="bg-[#ff3a3a] text-white px-3 py-1 rounded hover:bg-[#ff6b6b] transition-colors text-sm"
                      >
                        Upload Note
                      </button>
                    )}
                    
                    {canCreateSubcategory && (
                      <button
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete subcategory"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Uploads for this subcategory */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Notes:</h4>
                  
                  {!uploads[subcategory.id] || uploads[subcategory.id].length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No notes uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uploads[subcategory.id].map((upload) => (
                        <div key={upload.id} className="border rounded-md p-3 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium truncate">{upload.file_name}</p>
                              <p className="text-xs text-gray-500">
                                By: {upload.first_name || upload.uploaded_by} {upload.last_name || ''}
                                {user && upload.uploaded_by === user.id && <span className="ml-1 text-[#ff3a3a]">(You)</span>}
                              </p>
                              <p className="text-xs text-gray-500">
                                Uploaded: {new Date(upload.uploaded_at).toLocaleDateString()}
                              </p>
                              {upload.description && (
                                <p className="text-xs text-gray-600 mt-1">{upload.description}</p>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              {/* View button */}
                              <Link
                                to={`/category/${id}/note/${upload.id}`}
                                className="text-[#ff3a3a] hover:text-[#ff6b6b]"
                                aria-label="View details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              </Link>
                              
                              {/* Comment button */}
                              <Link
                                to={`/category/${id}/note/${upload.id}#comments`}
                                className="text-blue-500 hover:text-blue-700"
                                aria-label="Comments"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                {upload.comment_count > 0 && (
                                  <span className="absolute -mt-2 -mr-2 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                    {upload.comment_count}
                                  </span>
                                )}
                              </Link>
                              
                              {/* Favorite button */}
                              {user && (
                                <button
                                  onClick={() => handleToggleFavorite(upload.id, subcategory.id)}
                                  className={favorites[upload.id] ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
                                  aria-label={favorites[upload.id] ? "Remove from favorites" : "Add to favorites"}
                                >
                                  {favorites[upload.id] ? (
                                    // Filled heart
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    // Outline heart
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  )}
                                </button>
                              )}
                              
                              {/* Download button */}
                              <a
                                href={upload.file_url}
                                download={upload.file_name}
                                className="text-green-500 hover:text-green-700"
                                aria-label="Download file"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </a>
                              
                              {/* Delete button (if user has permission) */}
                              {user && (user.id === upload.uploaded_by || user.role === 'ADMIN') && (
                                <button
                                  onClick={() => handleDeleteUpload(upload.id, subcategory.id)}
                                  className="text-red-500 hover:text-red-700"
                                  aria-label="Delete upload"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Tags section */}
                          {upload.tags && upload.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {upload.tags.map(tag => (
                                <span key={tag.id} className="text-xs bg-gray-200 px-1 py-0.5 rounded">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8">
          <Link to="/" className="text-[#ff3a3a] hover:text-[#ff6b6b]">
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {/* Create Subcategory Modal */}
      <CreateSubcategoryModal
        isOpen={showSubcatModal}
        onClose={() => setShowSubcatModal(false)}
        categoryId={id}
        onSuccess={handleAddSubcategory}
      />

      {/* Upload Note Modal */}
      {selectedSubcategory && (
        <UploadNoteModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          subcategoryId={selectedSubcategory}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default CategoryPage;