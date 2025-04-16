// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-primary">NeuNotes</h3>
            <p className="text-sm mt-1">Share academic notes with ease</p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/" className="text-white hover:text-accent text-sm">
              Home
            </Link>
            <Link to="/login" className="text-white hover:text-accent text-sm">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:text-accent text-sm">
              Sign Up
            </Link>
          </div>
          
          <div className="text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} NeuNotes. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;