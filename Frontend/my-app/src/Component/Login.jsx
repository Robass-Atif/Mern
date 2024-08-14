import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
    
      // Assuming the backend sends a success field
      if (response.data.success) {
        setMessage('Login successful!');
        // Navigate to the dashboard with email as state
        navigate('/dashboard', { state: { email } });
      } else {
        console.error('Login failed:', response.data.message);
        setMessage(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Error handling for network or server errors
      console.error('Error logging in:', error.response ? error.response.data.message : error.message);
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
