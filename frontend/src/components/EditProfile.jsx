import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: '',
    favoriteMovies: '',
    favoriteGenre: 'NA',
    birthday: '',
    gender: 'NA',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
  });
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
        const user = response.data.user;
        setFormData({
          name: user.name,
          email: user.email,
          profileImage: user.profileImage || '',
          favoriteMovies: user.favoriteMovies.join(', '), // Convert array to string
          favoriteGenre: user.favoriteGenre,
          birthday: user.personalDetails?.birthday?.slice(0, 10) || '', // Format date
          gender: user.personalDetails?.gender || 'NA',
          address: {
            street: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            postalCode: user.address?.postalCode || '',
          },
        });
      } catch (error) {
        setError('Failed to fetch user data');
        console.error(error);
      }
    };

    fetchData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('authToken');
      const updatedData = {
        ...formData,
        favoriteMovies: formData.favoriteMovies.split(',').map((movie) => movie.trim()), // Convert string back to array
      };
      await axios.put('http://localhost:5000/api/auth/editprofile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/profile'); // Redirect back to profile
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8 pt-[85px]">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          {/* Profile Image */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Profile Image URL</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          {/* Favorite Movies */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Favorite Movies (comma-separated)</label>
            <input
              type="text"
              name="favoriteMovies"
              value={formData.favoriteMovies}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          {/* Favorite Genre */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Favorite Genre</label>
            <select
              name="favoriteGenre"
              value={formData.favoriteGenre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="NA">Select Genre</option>
              <option value="Action">Action</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comedy</option>
              <option value="Horror">Horror</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
            </select>
          </div>
          {/* Birthday */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            >
              <option value="NA">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Address</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              placeholder="Street"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-2"
            />
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-2"
            />
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-2"
            />
            <input
              type="text"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
