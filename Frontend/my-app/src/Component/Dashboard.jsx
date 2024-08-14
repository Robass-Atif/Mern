import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// use params to get email from login  page
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const location = useLocation();

  useEffect(() => {
    const { email } = location.state || {};
    console.log('Location state:', location.state);
    setUserEmail(email);
  }, [location.state]);
  const [projects, setProjects] = useState([]);
  const [userEmail, setUserEmail] = useState(''); // Replace with actual email fetching logic
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the projects from an API
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects',
          
        ); // Adjust the API endpoint as needed
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProfileClick = () => {
    // Redirect to the user-profile page with the email as a state
    navigate('/user-profile', { state: { email: userEmail } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          tasks: [], // Ensure this matches what the backend expects
          email: userEmail, // Add userEmail to the request body
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setProjects((prev) => [...prev, data]);
        setNewProject({ title: '', description: '' }); // Clear form fields
      } else {
        const errorText = await response.text();
        console.error('Failed to create project:', errorText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow">
        <nav className="flex justify-between items-center">
          <a href="#" className="text-lg font-bold">Dashboard</a>
          <div className="flex items-center">
            <button 
              onClick={handleProfileClick} 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Profile
            </button>
          </div>
        </nav>
      </header>
      <main className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {userEmail}!</p>
        <section className="mt-4">
          <h2 className="text-lg font-bold text-gray-800">Create New Project</h2>
          <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg mt-2">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={newProject.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-indigo-600 text-white rounded"
            >
              Create Project
            </button>
          </form>
        </section>
        <section className="mt-4">
          <h2 className="text-lg font-bold text-gray-800">Your Projects</h2>
          <ul className="mt-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li key={project.id} className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2">
                  <p>{project.title}</p>
                  <button 
                    onClick={() => window.location.href = `/project/${project.title}`} 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                    Go to Project
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No projects found.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
