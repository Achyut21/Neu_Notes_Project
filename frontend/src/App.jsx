// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './contexts/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CategoryPage from './pages/CategoryPage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FavoritesPage from './pages/FavoritesPage';
import NoteDetails from './components/NoteDetails';


// Protected route component for any authenticated user
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3a3a]"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin-only route component
const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3a3a]"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  const { checkAuth, isLoading } = useAuthStore();
  
  useEffect(() => {
    // Check authentication status when app loads
    checkAuth();
  }, [checkAuth]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f8f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff3a3a]"></div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8f8f8]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* New routes for the additional features */}
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/category/:categoryId/note/:uploadId" element={<NoteDetails />} />
            
            <Route path="*" element={<Navigate to="/" />} /> {/* Catch all route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;