import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlockedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1
        className="text-3xl font-bold text-red-500 mb-4"
        aria-live="assertive"
      >
        Access Blocked
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You are already logged in. Please log out to access this page.
      </p>
      <button
        aria-label="Go to Home Page"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md transform hover:scale-105 hover:bg-blue-600 transition-all duration-200"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default BlockedPage;
