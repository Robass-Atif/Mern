import React from 'react';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
        <form className="mt-4">
          <input type="email" placeholder="Email" className="w-full p-2 mt-2 border border-gray-300 rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 mt-2 border border-gray-300 rounded" />
          <button className="w-full p-2 mt-4 bg-indigo-600 text-white rounded">Sign Up</button>
        </form>
        <button className="w-full p-2 mt-2 bg-blue-600 text-white rounded">Sign Up with Facebook</button>
        <a href="#forgot" className="block text-center text-indigo-600 mt-4">Forgot Password?</a>
      </div>
    </div>
  );
};

export default SignupPage;
