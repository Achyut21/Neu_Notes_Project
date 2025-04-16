// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';
import SubjectCards from '../components/SubjectCards';
import SearchBar from '../components/SearchBar';
import CreateCategoryModal from '../components/CreateCategoryModal';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuthStore();

  // Check if user can create categories
  const canCreateCategory = user && (user.role === 'ADMIN' || user.role === 'FACULTY');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/category');
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredCategories(categories);
      return;
    }
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      category.code.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredCategories(filtered);
  };

  const handleCreateCategory = (newCategory) => {
    setCategories(prev => [newCategory, ...prev]);
    setFilteredCategories(prev => [newCategory, ...prev]);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/category/${id}`);
        setCategories(prev => prev.filter(category => category.id !== id));
        setFilteredCategories(prev => prev.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-primary">Neu</span>Notes
            </h1>
            <p className="mt-4 text-xl">
              Share academic notes and enhance collaborative learning
            </p>
            
            <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            {user ? (
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {canCreateCategory && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-accent transition-colors"
                  >
                    Create New Course
                  </button>
                )}
                
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="bg-accent text-white px-6 py-3 rounded-md hover:bg-primary transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <Link
                  to="/login"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-accent transition-colors mr-4"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-accent text-white px-6 py-3 rounded-md hover:bg-primary transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">Available Courses</h2>
          
          {canCreateCategory && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition-colors"
            >
              Create Category
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No categories found</p>
            {canCreateCategory && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Create Your First Category
              </button>
            )}
          </div>
        ) : (
          <SubjectCards
            categories={filteredCategories}
            onDelete={handleDeleteCategory}
            currentUser={user}
          />
        )}
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateCategory}
      />
    </div>
  );
};

export default Home;