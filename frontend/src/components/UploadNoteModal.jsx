// src/components/UploadNoteModal.jsx
import React, { useState } from 'react';
import api from '../services/api';

const UploadNoteModal = ({ isOpen, onClose, subcategoryId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.type;
      if (fileType !== 'application/pdf' && 
          fileType !== 'image/png' && 
          fileType !== 'image/jpeg' && 
          fileType !== 'image/jpg') {
        setError('Only PDF, PNG, JPG, and JPEG files are allowed');
        setFile(null);
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should not exceed 10MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setUploadProgress(0);
      
      // Create FormData object to send file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subcategory_id', subcategoryId);
      
      if (description) {
        formData.append('description', description);
      }
      
      // Special config for multipart/form-data with progress tracking
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      setFile(null);
      setDescription('');
      setUploadProgress(0);
      onSuccess(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDescription('');
    setError('');
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary">Upload Note</h2>
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
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              File (PDF or Image) *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                id="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="mt-2 text-sm text-gray-500">
                  {file ? file.name : 'Click to select a file or drag and drop'}
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  PDF, PNG, JPG, JPEG up to 10MB
                </span>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              rows="3"
              placeholder="Add a brief description of this note"
            ></textarea>
          </div>

          {isLoading && uploadProgress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-right mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border text-secondary hover:bg-gray-100 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !file}
              className="px-4 py-2 bg-primary text-white hover:bg-accent rounded disabled:opacity-50"
            >
              {isLoading ? 'Uploading...' : 'Upload Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNoteModal;