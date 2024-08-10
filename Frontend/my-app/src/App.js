import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Component/Landing/Home';
import SignUp from './Component/SignUp';
import Dashboard from './Component/Dashboard';
import ProjectPage from './Component/projectPage';
import UserProfilePage from './Component/UserProfile';
import Hello from './Component/Landing/hello';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Hello /> } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
