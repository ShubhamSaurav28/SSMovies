const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    profileImage: {
      type: String,
      default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png',
    },
    favoriteMovies: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.every(item => typeof item === 'string' && item.trim().length > 0);
        },
        message: 'Favorite movies must be a non-empty array of strings',
      },
    },
    favoriteGenre: {
      type: String,
      enum: ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'NA'],
      default: 'NA',
    },
    moviesBooked: {
      type: [
        {
          title: {
            type: String,
            required: [true, 'Movie title is required'],
            default: 'NA',
          },
          date: {
            type: Date,
            default: null,
          },
          time: {
            type: String,
            default: 'NA',
          },
          status: {
            type: String,
            enum: ['Confirmed', 'Pending', 'Cancelled'],
            default: 'Pending',
          },
        },
      ],
      default: [],
    },
    personalDetails: {
      birthday: {
        type: Date,
        default: null,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'NA'],
        default: 'NA',
      },
    },
    address: {
      street: {
        type: String,
        default: 'NA',
      },
      city: {
        type: String,
        default: 'NA',
      },
      state: {
        type: String,
        default: 'NA',
      },
      postalCode: {
        type: String,
        default: 'NA',
      },
    },
  },
  {
    timestamps: true,
  }
);


// Method to compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword, hashedPassword) {
  // Ensure bcrypt is used during password verification
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, hashedPassword);
};

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
