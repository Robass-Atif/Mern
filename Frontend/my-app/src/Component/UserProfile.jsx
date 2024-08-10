import React from 'react';

const UserProfilePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        <form className="mt-4">
          <input type="text" placeholder="Username" className="w-full p-2 mt-2 border border-gray-300 rounded" />
          <input type="password" placeholder="Change Password" className="w-full p-2 mt-2 border border-gray-300 rounded" />
          <button className="w-full p-2 mt-4 bg-indigo-600 text-white rounded">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
