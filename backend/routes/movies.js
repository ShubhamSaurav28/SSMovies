const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Movie = require('../models/Movie');

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
      const movie = await Movie.findById(movieId); // Assuming movieId is a MongoDB ObjectId
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(movie); // Send movie data as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;

