// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../contexts/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="bg-[#212121] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-[#ff3a3a]">NeuNotes</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-white hover:text-[#ff6b6b] px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            
            {user && (
              <Link to="/favorites" className="text-white hover:text-[#ff6b6b] px-3 py-2 rounded-md text-sm font-medium">
                Favorites
              </Link>
            )}
            
            {user ? (
              <>
                <Link to="/profile" className="text-white hover:text-[#ff6b6b] px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-white hover:text-[#ff6b6b] px-3 py-2 rounded-md text-sm font-medium">
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="ml-4 flex items-center space-x-4">
                  <span className="text-sm">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-xs bg-[#ff3a3a] px-2 py-1 rounded">
                    {user.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-[#ff3a3a] hover:bg-[#ff6b6b] px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-white hover:text-[#ff6b6b] px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-[#ff3a3a] hover:bg-[#ff6b6b] px-3 py-1 rounded">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#ff6b6b] focus:outline-none"
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
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {user && (
            <Link 
              to="/favorites" 
              className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Favorites
            </Link>
          )}
          
          {user ? (
            <>
              <Link 
                to="/profile" 
                className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              
              {user.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="px-3 py-2">
                <div className="text-sm">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs bg-[#ff3a3a] inline-block px-2 py-1 rounded mt-1">
                  {user.role}
                </div>
              </div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-white hover:text-[#ff6b6b] block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-white hover:text-[#ff6b6b] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;