// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search for notes, courses..." }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  // Handle click outside to collapse search on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Perform search on typing with debounce (can be implemented if needed)
    if (value === '') {
      onSearch('');
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div
      ref={searchRef}
      className={`relative mx-auto transition-all duration-300 ${
        isExpanded ? 'w-full' : 'w-full max-w-lg'
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={() => setIsExpanded(true)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;