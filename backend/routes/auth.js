const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const verifyToken = require('../middleware/verifytoken');

const router = express.Router();

// Input validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: 'Too many login attempts from this IP, please try again later.',
});

// Register route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = await registerSchema.validateAsync(req.body);

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Login route
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    const newUser = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({ token, message: 'Login successful.', newUser });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Retrieve the user's ID from the decoded token
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare and send user data, including additional fields
    res.json({
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        personalDetails: user.personalDetails,
        address: user.address,
        favoriteGenre: user.favoriteGenre, // Adjust or add additional fields as required
        favoriteMovies: user.favoriteMovies || [], // Ensure safe default
        moviesBooked: user.moviesBooked || [],
      }
    });
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/editprofile', verifyToken, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      profileImage, 
      favoriteMovies, 
      favoriteGenre, 
      birthday, 
      gender, 
      address 
    } = req.body;

    // Convert favoriteMovies to an array of strings, allowing empty array
    const moviesArray = favoriteMovies && favoriteMovies[0] !== ""
    ? favoriteMovies.split(',').map(movie => movie.trim()).filter(movie => movie !== '') // Remove empty strings
    : [];


    // Prepare the update object
    const updateData = {
      name,
      email,
      profileImage,
      favoriteMovies: moviesArray, // Allow empty array if no favoriteMovies
      favoriteGenre,
      personalDetails: {
        birthday,
        gender
      },
      address: {
        street: address?.street || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || ''
      }
    };

    // Find and update the user by email
    const user = await User.findOneAndUpdate(
      { email }, // Find the user by email
      updateData,
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Internal server error. Error Updating Profile' });
  }
});








module.exports = router;
