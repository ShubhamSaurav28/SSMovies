import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
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
    return <Loading/>;
  }

  // Format the birthday date
  const formattedBirthday = new Date(user.personalDetails?.birthday).toLocaleDateString();

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

        {/* User Details Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-semibold">Personal Details</h2>
          <p className="text-gray-400 mt-2">Favorite Genre: {user.favoriteGenre || 'N/A'}</p>
          <p className="text-gray-400">Birthday: {formattedBirthday || 'N/A'}</p>
          <p className="text-gray-400">Gender: {user.personalDetails?.gender || 'N/A'}</p>
        </div>

        {/* Address Section */}
        <div className="mt-4">
          <h2 className="text-3xl font-semibold">Address</h2>
          <p className="text-gray-400">
            {user.personalDetails?.address?.street || 'N/A'},
            {user.personalDetails?.address?.city || 'N/A'},
            {user.personalDetails?.address?.state || 'N/A'},
            {user.personalDetails?.address?.postalCode || 'N/A'}
          </p>
        </div>

        {/* Favorite Movies Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold">Your Favorite Movies</h2>
          {user.favoriteMovies.length > 0 ? (
            <div className="mt-4 flex space-x-6">
              {user.favoriteMovies.map((movie, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md w-32 text-center">
                  <h3 className="text-lg font-semibold">{movie}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-2">No favorite movies added.</p>
          )}
        </div>

        {/* Upcoming Movies Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold">Upcoming Movie Bookings</h2>
          {user.moviesBooked.length > 0 ? (
            <div className="mt-4">
              {user.moviesBooked.map((movie, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-xl font-semibold">{movie.title}</h3>
                  <p className="text-gray-400">
                    {movie.date} - {movie.time}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-2">No upcoming bookings.</p>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold">Movie Recommendations</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Sample Movie</h3>
              <p className="text-gray-400">Recommended based on your preferences!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
