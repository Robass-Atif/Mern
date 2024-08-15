import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      if (response.data.success) {
        setMessage('Login successful!');
        navigate('/dashboard', { state: { email } });
      } else {
        console.error('Login failed:', response.data.message);
        setMessage(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data.message : error.message);
      setMessage(error.response ? error.response.data.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const tokenId = response.credential;
      const res = await axios.post('http://localhost:5000/api/users/google-login', {
        tokenId,
      });

      if (res.data.success) {
        setMessage('Google login successful!');
        navigate('/dashboard', { state: { email: res.data.email } });
      } else {
        setMessage(res.data.message || 'Google login failed.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setMessage('An error occurred with Google login. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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

          {/* Google Login Button */}
          <div className="mt-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setMessage('Google login failed. Please try again.')}
            />
          </div>

          {/* Sign Up Button */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <button
              onClick={() => navigate('/signup')}
              className="mt-2 text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
