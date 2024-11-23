import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = useCallback(async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      alert('Sign up successful!');
      navigate('/login');
    } catch (err) {
      setError('Error during sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-indigo-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Create Your Account</h1>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</div>}

        <input
          type="text"
          placeholder="Full Name"
          aria-label="Full Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Email Address"
          aria-label="Email Address"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          aria-label="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          aria-label="Confirm Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full py-3 rounded-md transition duration-200 ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
