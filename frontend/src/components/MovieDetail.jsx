import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTicketAlt, FaStar } from 'react-icons/fa'; // Importing icons for better visuals

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching movie details');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-center mt-20">{error}</div>;
  if (!movie) return <div className="text-center mt-20">Movie not found!</div>;

  return (
    <div className="container mx-auto p-6 pt-[75px]">
      {/* Movie Banner */}
      <div
        className="relative bg-cover bg-center rounded-lg shadow-lg"
        style={{ backgroundImage: `url(${movie.movie_image})`, height: '400px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-5xl font-bold">{movie.title}</h1>
          <div className="flex items-center mt-3">
            <span className="flex items-center text-yellow-400 text-lg mr-4">
              <FaStar className="mr-1" /> {movie.rating} / 10
            </span>
            <span className="text-lg">Genre: {movie.genre}</span>
          </div>
          <span className="block text-gray-300 text-sm mt-2">{movie.language} | {movie.duration} minutes</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-8 flex flex-col lg:flex-row">
        {/* Movie Info */}
        <div className="lg:w-3/5">
          <h2 className="text-2xl font-semibold mb-4">About the Movie</h2>
          <p className="text-gray-700 leading-relaxed">{movie.description}</p>

          {/* Director Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Director</h3>
            <div className="flex items-center">
              <img
                src={movie.director.image}
                alt={movie.director.name}
                className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
              />
              <span className="text-lg">{movie.director.name}</span>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.cast.map((actor, index) => (
                <div key={index} className="text-center">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto shadow-lg"
                  />
                  <span className="text-sm block mt-2">{actor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Showtime Section */}
        <div className="lg:w-2/5 lg:pl-8 mt-8 lg:mt-0">
          <h3 className="text-2xl font-semibold mb-4">Available Showtimes</h3>
          <div className="space-y-4">
            {movie.showtimes.map((time, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg shadow-md flex justify-between items-center ${
                  time.is_sold_out ? 'bg-gray-200' : 'bg-white'
                }`}
              >
                <div>
                  <p className="text-lg font-medium">
                    {new Date(time.show_time).toLocaleString()}
                  </p>
                  <p className="text-gray-600">Hall: {time.hall_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${time.ticket_price}
                  </p>
                  {time.is_sold_out ? (
                    <span className="text-red-500 text-sm">Sold Out</span>
                  ) : (
                    <button className="mt-2 py-1 px-3 bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700">
                      <FaTicketAlt /> Book Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
