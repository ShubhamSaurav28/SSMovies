const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  showtimes: [
    {
      show_time: { type: Date, required: true },
      ticket_price: { type: Number, required: true },
      is_sold_out: { type: Boolean, required: true },
      seating_capacity: { type: Number, required: true },
      hall_name: { type: String, required: true }
    }
  ],
  duration: { type: Number, required: true }, // duration in minutes
  releaseDate: { type: Date, required: true },
  description: { type: String, required: true },
  director: {
    name: { type: String, required: true },
    image: { type: String, required: true }
  },
  cast: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true }
    }
  ],
  movie_image: { type: String, required: true },
  rating: { type: Number, required: true },
});

module.exports = mongoose.model('Movie', movieSchema);
