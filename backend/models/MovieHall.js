const mongoose = require('mongoose');

// Define the Movie Hall Schema
const movieHallSchema = new mongoose.Schema({
  movieHallName: { 
    type: String, 
    required: true 
  },
  totalRows: { 
    type: Number, 
    required: true 
  },
  totalColumns: { 
    type: Number, 
    required: true 
  },
  seats: [
    {
      seatId: { 
        type: String, 
        required: true 
      },
      isBooked: { 
        type: Boolean, 
        default: false 
      },
      isSelected: { 
        type: Boolean, 
        default: false 
      },
      isAvailable: { 
        type: Boolean, 
        default: true 
      }
    }
  ],
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String 
  },
  password: { 
    type: String 
  },
  shows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }
  ],
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  ]
}, { timestamps: true });  // Timestamps will help you keep track of when the movie hall was created or updated

// Model definition
const MovieHall = mongoose.model('MovieHall', movieHallSchema);

// Export the schema for use in other parts of the application
module.exports = MovieHall;
