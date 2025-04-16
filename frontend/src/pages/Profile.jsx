// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../contexts/authStore';

const Profile = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    status: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        status: user.status || 'Undergraduate'
      });
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user's enrollments, uploads, and activities in parallel
      const requests = [api.get('/upload/my-uploads')];
      
      // Only fetch enrollments for students
      if (user.role === 'STUDENT') {
        requests.push(api.get('/enrollment/my-enrollments'));
      }
      
      // Fetch user activities
      requests.push(api.get('/activity/my-activities'));
      
      const responses = await Promise.all(requests);
      
      // Set uploads (always present)
      setUploads(responses[0].data);
      
      // Set enrollments (if student)
      if (user.role === 'STUDENT') {
        setEnrollments(responses[1].data);
        setActivities(responses[2].data);
      } else {
        setActivities(responses[1].data);
      }
      
    } catch (error) {
      setError('Failed to load profile data');
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await api.delete(`/enrollment/${enrollmentId}`);
        setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      } catch (error) {
        console.error('Error unenrolling:', error);
        alert('Failed to unenroll from course');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      await api.put('/user/profile', formData);
      
      // Update the user in the global state
      updateUserProfile(formData);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Please sign in to view your profile.
        </div>
        <Link to="/login" className="mt-4 inline-block text-primary hover:text-accent">
          Go to Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-secondary text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm mt-1">Manage your account and view your activity</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            
            {user.role === 'STUDENT' && (
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'enrollments' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Enrollments
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('uploads')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'uploads' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Uploads
            </button>
            
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activities' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity Log
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-md p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary">Personal Information</h2>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-accent"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {user.email}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white hover:bg-accent rounded"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border text-secondary hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Role</p>
                    <p className="font-medium">
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs">
                        {user.role}
                      </span>
                    </p>
                  </div>
                  {user.status && (
                    <div>
                      <p className="text-gray-600">Academic Status</p>
                      <p className="font-medium">{user.status}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Enrollments Tab (for students) */}
          {activeTab === 'enrollments' && user.role === 'STUDENT' && (
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">My Enrollments</h2>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded">
                  <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                  <Link to="/" className="mt-2 inline-block text-primary hover:text-accent">
                    Browse Available Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            to={`/category/${enrollment.category_id}`}
                            className="font-medium text-secondary hover:text-primary"
                          >
                            {enrollment.category_name}
                          </Link>
                          <p className="text-sm text-gray-500">Code: {enrollment.category_code}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Enrolled on: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnenroll(enrollment.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Uploads Tab */}
          {activeTab === 'uploads' && (
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">My Uploads</h2>
              
              {uploads.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded">
                  <p className="text-gray-500">You haven't uploaded any notes yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uploads.map((upload) => (
                        <tr key={upload.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{upload.file_name}</div>
                            {upload.description && (
                              <div className="text-xs text-gray-500">{upload.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/category/${upload.category_id}`} className="text-sm text-primary hover:text-accent">
                              {upload.category_name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{upload.subcategory_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(upload.uploaded_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <a
                                href={upload.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                                aria-label="Download file"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-4">Activity Log</h2>
              
              {activities.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded">
                  <p className="text-gray-500">No activities recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-b pb-3">
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-700">{activity.action}</div>
                        <div className="text-xs text-gray-500">{formatDate(activity.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;