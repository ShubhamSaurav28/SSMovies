import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from './SeatSelection';

const BookingPage = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovieDetails(res.data);
        setShowtimes(res.data.showtimes);
      } catch (err) {
        setError('Failed to fetch movie data. Please try again later.');
      }
    };
    fetchMovieData();
  }, [movieId]);

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      setError('Please select a showtime and at least one seat.');
      return;
    }

    try {
      const bookingData = {
        movieId,
        showtime: selectedShowtime,
        seats: selectedSeats,
      };
      const token = sessionStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/movies/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Booking successful!');
      navigate('/profile');
    } catch (err) {
      setError('Failed to book the movie. Please try again later.');
    }
  };

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-background-image.jpg)' }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-5xl w-full space-y-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-background-image.jpg)' }}>
      <div className="bg-black bg-opacity-60 min-h-screen flex justify-center items-center p-4 pt-[85px]">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-5xl w-full space-y-8">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md text-center">
              {error}
            </div>
          )}

          {/* Movie Details */}
          <div className="flex items-center justify-between mb-8">
            <img
              src={movieDetails.movie_image}
              alt={movieDetails.title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg transition transform hover:scale-105"
            />
            <div className="ml-6 flex-1">
              <h2 className="text-4xl font-extrabold text-indigo-600">{movieDetails.title}</h2>
              <p className="text-lg text-gray-800 mt-4">{movieDetails.description}</p>
              <p className="mt-2 text-gray-600">Directed by {movieDetails.director.name}</p>
            </div>
          </div>

          {/* Showtimes */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-700">Select Showtime</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {showtimes.map((showtime, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedShowtime(showtime.show_time)}
                  className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 
                    ${selectedShowtime === showtime.show_time ? 'bg-indigo-600' : 'bg-indigo-400 hover:bg-indigo-500'}`}
                >
                  {new Date(showtime.show_time).toLocaleTimeString()}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <SeatSelection seatLayout={movieDetails.seatLayout} onSelectSeats={handleSeatSelection} />

          <div className="flex justify-between items-center">
            <button
              onClick={handleBooking}
              className="py-3 px-6 bg-indigo-600 text-white rounded-md font-semibold transition duration-300 hover:bg-indigo-500"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
