import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './Component/SignUp';
import Dashboard from './Component/Dashboard';
import ProjectPage from './Component/projectPage';
import UserProfilePage from './Component/UserProfile';
import Landing from './Component/Landing/Landing';
import Login from './Component/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Dynamic routing for ProjectPage */}
          <Route path="/project/:title" element={<ProjectPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
