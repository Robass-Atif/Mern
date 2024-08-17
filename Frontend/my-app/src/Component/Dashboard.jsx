import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);



  // UseEffect to set userEmail when component mounts or location.state changes
  const getEmail = async () => {

   try {
    const response = await axios.get('http://localhost:5000/login/success', { withCredentials: true });
    const data= await response.data;
    console.log(data);
    console.log(data.data);
    setUserEmail(data.data);
    setIsVisible(true);
    
   } catch (error) {
    console.error('Failed to fetch projects:', error);
    
   }
  }

  useEffect(() => {
    getEmail();
  }, []);

    

  // UseEffect to set userEmail when component mounts or location.state changes
  useEffect(() => {
    const { email } = location.state || {};
    if (email) {
      setUserEmail(email);
    }
  }, [location.state]);

  // UseEffect to fetch projects when userEmail changes
  useEffect(() => {
    if (!userEmail) return; // Do nothing if userEmail is not set

    const fetchProjects = async () => {
      try {
        console.log('Fetching projects for:', userEmail);
        const response = await fetch('http://localhost:5000/api/projects/all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data); // Initialize filteredProjects with all projects
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, [userEmail]);

  const handleProfileClick = () => {
    navigate('/user-profile', { state: { email: userEmail } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter projects based on the search term
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
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
          tasks: [],
          email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects((prev) => [...prev, data]);
        setFilteredProjects((prev) => [...prev, data]); // Update filteredProjects with new project
        setNewProject({ title: '', description: '' });
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
        <a href="#" className="text-lg font-bold">
          Dashboard
        </a>
        <div className="flex items-center">
         {isVisible &&
          <button
            onClick={handleProfileClick}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          >
            Profile
          </button>
}
        </div>
      </nav>
    </header>
    <main className="p-4 flex">
      <section className='w-3/5'>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {userEmail}!</p>
      </section>
      <section className="">
        <h2 className="text-lg font-bold text-gray-800">
          Create New Project
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 shadow rounded-lg mt-2"
        >
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
            rows={5}
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
    </main>
    <section className="mt-4 p-4">
      <h2 className="text-lg font-bold text-gray-800">Your Projects</h2>
      <input
        type="text"
        placeholder="Search projects"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mt-2 border border-gray-300 rounded"
      />
      <ul className="mt-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <li
              key={project._id}
              className="flex justify-between items-center bg-white shadow p-4 rounded-lg mt-2"
            >
              <p>{project.title}</p>
              <button
                onClick={() => navigate(`/project/${project.title}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Go to Project
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No projects found.</p>
        )}
      </ul>
    </section>
  </div>
);

  
};

export default DashboardPage;
