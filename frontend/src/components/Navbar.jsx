// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../contexts/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`bg-secondary text-white sticky top-0 z-10 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">NeuNotes</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
              }`}
            >
              Home
            </Link>
            
            {user && (
              <Link 
                to="/favorites" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/favorites') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
                }`}
              >
                Favorites
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
                  }`}
                >
                  Profile
                </Link>
                
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="ml-4 flex items-center space-x-4">
                  <div className="bg-secondary-dark px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm mr-2">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs bg-primary px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-primary hover:bg-accent px-3 py-1 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-accent px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-primary hover:bg-accent px-3 py-1 rounded transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary-dark">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {user && (
            <Link 
              to="/favorites" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/favorites') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
          )}
          
          {user ? (
            <>
              <Link 
                to="/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              
              {user.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin') ? 'text-primary bg-secondary-light' : 'text-white hover:text-accent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="px-3 py-2 border-t border-gray-700 mt-2 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-primary">{user.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-accent"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Link 
                to="/login" 
                className="text-white hover:text-accent block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-primary text-white px-3 py-2 rounded hover:bg-accent text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;