import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard'; // Assuming you have a MovieCard component
import { useNavigate } from 'react-router-dom';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const navigate = useNavigate();

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
        setFilteredMovies(res.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies based on user input
  const handleFilter = () => {
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) =>
          genre.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (movie) =>
          new Date(movie.releaseDate).getFullYear().toString() === selectedYear
      );
    }

    if (selectedRating) {
      filtered = filtered.filter((movie) => movie.rating >= selectedRating);
    }

    setFilteredMovies(filtered);
  };

  // Run filter whenever a filter value changes
  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 pt-[85px]">
      <h1 className="text-4xl font-bold text-center mb-8">Explore Movies</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {/* Search Bar */}
        <div className="w-full max-w-md self-end">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="py-2 px-4 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Genres</option>
            {Array.from(
              new Set(movies.flatMap((movie) => movie.genres))
            ).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="py-2 px-4 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Years</option>
            {Array.from(
              new Set(
                movies.map((movie) =>
                  new Date(movie.releaseDate).getFullYear().toString()
                )
              )
            )
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="py-2 px-4 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Ratings</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
              <option key={rating} value={rating}>
                {rating}+
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.length ? (
          filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} navigate={navigate} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">
            No movies found matching the selected criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
