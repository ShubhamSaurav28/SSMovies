import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const token = sessionStorage.getItem('authToken');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="bg-indigo-600 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/" className="text-white text-2xl font-bold">
            SSMovies
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-white text-lg hover:text-indigo-200 transition duration-200">
            Home
          </Link>
          <Link to="/movies" className="text-white text-lg hover:text-indigo-200 transition duration-200">
            Movies
          </Link>
          <Link to="/bookings" className="text-white text-lg hover:text-indigo-200 transition duration-200">
            Bookings
          </Link>
          <Link to="/profile" className="text-white text-lg hover:text-indigo-200 transition duration-200">
            Profile
          </Link>
        </nav>

        {/* Authentication / Dropdown */}
        <div className="flex items-center space-x-2">
          {!token ? (
            <>
              <Link
                to="/login"
                className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <img
                  src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
                  alt="User Avatar"
                  className="w-10 h-8 rounded"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48">
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigate('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
