// src/components/EditSubcategoryModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditSubcategoryModal = ({ isOpen, onClose, subcategory, onSuccess }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.name || '');
    }
  }, [subcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Subcategory name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.put(`/subcategory/${subcategory.id}`, { name });
      
      onSuccess(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update subcategory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary">Edit Subcategory</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory Name *
            </label>
            <input
              type="text"
              id="subcategoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border text-secondary hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white hover:bg-accent rounded disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubcategoryModal;

