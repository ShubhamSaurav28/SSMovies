const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Movie = require('../models/Movie');
const MovieHall = require('../models/MovieHall')
const verifyToken = require('../middleware/verifytoken');


require('dotenv').config();


router.post('/book', async (req, res) => {
    const { movieId, showtime, seatNumbers } = req.body;
  
    const movie = await Movie.findById(movieId);
    const updatedSeats = { ...movie.seats };
  
    for (const seat of seatNumbers) {
      if (updatedSeats[seat]) {
        return res.status(400).send('Seat already booked');
      }
      updatedSeats[seat] = true;
    }
  
    movie.seats = updatedSeats;
    await movie.save();
  
    res.status(200).send('Booking successful');
  });
  

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/payment', async (req, res) => {
  const { amount } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100, // Convert to paisa
      currency: 'INR',
    });
    res.json(payment);
  } catch (err) {
    res.status(500).send('Payment creation failed');
  }
});

router.get('/front', async (req, res) => {
  try {
    const movies = await Movie.find().limit(4); // Limit the number of movies to 4
    res.status(200).json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find(); // Limit the number of movies to 4
    res.status(200).json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

  router.get('/:movieId', async (req, res) => {
    const { movieId } = req.params; // Get the movieId from the URL parameter
  
    try {
      const movie = await Movie.findById(movieId).populate('movieHall'); // Assuming movieId is a MongoDB ObjectId
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(movie); // Send movie data as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/halls/:hallId', async (req, res) => {
    try {
      const hallId = req.params.hallId;
      
      // Find hall by ID
      const hall = await MovieHall.findById(hallId);
      
      if (!hall) {
        return res.status(404).json({ message: 'Hall not found' });
      }
      
      // Send hall data as response
      res.status(200).json(hall);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



// Route to book a movie
router.post('/bookings', verifyToken, async (req, res) => {
  const { movieId, showtime, seats } = req.body;
  const userId = req.user._id; // From the JWT token

  console.log(movieId);
  console.log(showtime);
  console.log(seats);
  console.log(userId);
  // Validate the input
  if (!movieId || !showtime || !seats || seats.length === 0) {
    return res.status(400).json({ error: 'Movie, showtime, and at least one seat are required.' });
  }

  try {
    // Fetch movie details from DB
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if the selected showtime exists and has available seats
    const showtimeDetails = movie.showtimes.find(
      (st) => st.time === showtime
    );

    if (!showtimeDetails) {
      return res.status(404).json({ error: 'Showtime not available' });
    }

    // Check if the number of seats is valid
    if (showtimeDetails.availableSeats < seats.length) {
      return res.status(400).json({
        error: 'Not enough available seats for the selected showtime.',
      });
    }

    // Create the booking record
    const booking = new Booking({
      userId,
      movieId,
      showtime,
      seats,
    });

    // Save booking
    await booking.save();

    // Update available seats in the movie
    showtimeDetails.availableSeats -= seats.length;
    await movie.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});
  

module.exports = router;

