import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      sessionStorage.setItem('authToken', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-indigo-50">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Login</h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-6 relative">
          <input
            type="password"
            placeholder="Enter your password"
            aria-label="Password"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-md transition duration-200 ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <a href="/signup" className="text-sm text-indigo-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
