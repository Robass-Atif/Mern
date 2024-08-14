import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        name,
        email,
        password,
      });
    
      console.log(response.data);
      if (response.data.success) {
        setMessage('Signup successful!');
        navigate('/login'); // Redirect to the login page
      } else {
        console.error('Signup failed:', response.data.message);
        setMessage(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error.response ? error.response.data.message : error.message);
      setMessage(error.response ? error.response.data.message : 'An error occurred');
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignup} className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            required
          />
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      
        
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
