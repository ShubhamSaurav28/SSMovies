import React from 'react';
import { useNavigate } from 'react-router-dom';


const MovieCard = ({ movie, navigate }) => {
    console.log(movie.title);
  const handleClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={handleClick}>
      <img src={movie.movie_image} alt={movie.title} className="w-full h-[20rem] object-fit rounded-md" />
      <h3 className="text-xl text-black font-semibold mt-4">{movie.title}</h3>
      <p className="text-sm text-gray-600">{movie.genres.join(', ')}</p>
    </div>
  );
};

export default MovieCard;
