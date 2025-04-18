// src/components/SubjectCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SubjectCard = ({ category, onDelete, onEdit, currentUser }) => {
  // Check if user can edit/delete this category
  const canManage = currentUser && (
    currentUser.role === 'ADMIN' || 
    currentUser.id === category.created_by
  );

  // Check if user is the creator of this category
  const isCreator = currentUser && currentUser.id === category.created_by;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/category/${category.id}`}>
        <div className="h-40 bg-gray-200 overflow-hidden">
          {category.image ? (
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-secondary">{category.code}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-secondary truncate">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">{category.code}</p>
            <p className="text-xs text-gray-500 mt-1">
              Created by: {category.first_name} {category.last_name}
              {isCreator && <span className="ml-1 text-primary">(You)</span>}
            </p>
          </div>
          
          {canManage && (
            <div className="flex space-x-2">
              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(category);
                }}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              
              {/* Delete button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(category.id);
                }}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SubjectCards = ({ categories, onDelete, onEdit, currentUser }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <SubjectCard 
          key={category.id} 
          category={category} 
          onDelete={onDelete}
          onEdit={onEdit}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default SubjectCards;