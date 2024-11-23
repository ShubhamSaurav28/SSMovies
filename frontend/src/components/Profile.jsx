import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Profile = () => {
  // State variables to store user data
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from local storage (or session)
        const token = sessionStorage.getItem('authToken'); // You might store it elsewhere (session, cookies, etc.)

        // Make an authenticated request with the token
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });
        setUser(response.data.user);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8 pt-[85px]">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-lg" />
          <div>
            <h1 className="text-4xl font-semibold">{user.name}</h1>
            <p className="text-lg text-gray-400">{user.email}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Favorite Movies Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-200">Your Favorite Movies</h2>
          <div className="mt-4 flex space-x-6">
            {user.favoriteMovies.map((movie, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md w-32 text-center">
                <h3 className="text-lg font-semibold">{movie}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Movies Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-200">Upcoming Movie Bookings</h2>
          <div className="mt-4">
            {user.moviesBooked.map((movie, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p className="text-gray-400">{movie.date} - {movie.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-200">Movie Recommendations</h2>
          <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">movie</h3>
                <p className="text-gray-400">Recommended for you based on your preferences!</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
