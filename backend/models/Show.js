const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
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
  description: { type: String, required: true },
  rating: { type: Number, required: true },
});

module.exports = mongoose.model('Show', showSchema);
     