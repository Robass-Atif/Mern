import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential,
      });

      console.log(response.data);
      if (response.data.success) {
        setMessage('Signup successful!');
        navigate('/dashboard'); // Redirect to the dashboard or another page
      } else {
        console.error('Signup failed:', response.data.message);
        setMessage(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up with Google:', error.response ? error.response.data.message : error.message);
      setMessage(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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

          {/* Sign Up with Google Button */}
          <div className="mt-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => {
                setMessage('Google Sign Up failed');
              }}
              className="w-full p-2 mt-4 bg-red-600 text-white rounded"
            >
              Sign Up with Google
            </GoogleLogin>
          </div>

          {/* Login Button */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <button
              onClick={() => navigate('/login')} // Navigate to the login page
              className="mt-2 text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignupPage;
