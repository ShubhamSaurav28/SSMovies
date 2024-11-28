import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/front').then((res) => setMovies(res.data));
  }, []);

  const handleBookTickets = (movieId) => {
    // Navigate to MovieDetail page with movieId as a URL parameter
    navigate(`/movies/${movieId}`);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-indigo-900 via-gray-900 to-black text-white min-h-screen pt-[75px]">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div
            className="relative bg-cover bg-center h-[400px] mb-12 rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundImage: "url('https://source.unsplash.com/1600x900/?cinema')",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h1 className="text-5xl font-bold text-white mb-4">Discover Movies You'll Love</h1>
              <p className="text-lg text-gray-300 mb-6">Book tickets for the latest blockbuster hits now!</p>
              <a href="/movies">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all">
                  Explore Now
                </button>
              </a>
            </div>
          </div>

          {/* Movie Grid Section */}
          <h2 className="text-3xl font-semibold mb-6">Popular Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={movie.movie_image}
                  alt={movie.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.genres.join(', ')}</p>
                  <p className="text-sm text-gray-500">{movie.language}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-yellow-500 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 20.25L9.045 17.19a1.5 1.5 0 00-1.08-.636l-3.9-.564a.75.75 0 01-.418-1.28l2.823-2.753a1.5 1.5 0 00.433-1.328l-.666-3.885a.75.75 0 011.086-.79l3.492 1.835a1.5 1.5 0 001.395 0l3.492-1.835a.75.75 0 011.086.79l-.666 3.885a1.5 1.5 0 00.433 1.328l2.823 2.753a.75.75 0 01-.418 1.28l-3.9.564a1.5 1.5 0 00-1.08.636l-2.205 3.06z"
                        />
                      </svg>
                      {movie.rating} / 10
                    </span>
                    <button
                      className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                      onClick={() => handleBookTickets(movie._id)} // Use navigate here
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <footer className="mt-12 text-center text-gray-400">
            <div className="flex justify-center gap-6 mb-4">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <p>&copy; 2024 Movie Booking, All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
