import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { FaTicketAlt, FaStar } from 'react-icons/fa'; // Importing icons for better visuals

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  const handleBookNow = (showtime) => {
    // Navigate to the booking page with movieId and showtime data
    navigate(`/book/${movieId}`, { state: { showtime } });
  };
  console.log(movie);
  console.log(movie.movieHall[0])


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
            <span className="text-lg">
              <strong>Genre:</strong> {movie.genres.join(', ')}
            </span>
          </div>
          <span className="block text-gray-300 text-sm mt-2">
            {new Date(movie.releaseDate).toLocaleDateString()} | {movie.language} | {movie.duration} minutes
          </span>
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

        {/* Movie Halls */}
        <div className="movie-halls mt-8 pl-3">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Movie Halls</h3>

        {movie.movieHall && movie.movieHall.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movie.movieHall.map((hall, index) => (
              <Link 
                key={index} 
                to={`/hall/${hall._id}`} 
                className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex flex-col items-start">
                  <h4 className="text-lg font-semibold text-white mb-2">{hall.movieHallName}</h4>
                  <p className="text-sm text-gray-400 mb-2">{hall.address}</p>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="mr-1">Capacity:</span>
                    <span>{hall.seats.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-red-500 text-white rounded-lg">
            No movie halls available
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MovieDetail;
