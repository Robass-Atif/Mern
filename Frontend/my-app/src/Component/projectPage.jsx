import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectPage = () => {
  // State to manage tasks and loading state
  const [tasks, setTasks] = useState(null); // null until data is fetched
  const [loading, setLoading] = useState(true);

  // State to manage new task inputs for each column
  const [newTasks, setNewTasks] = useState({
    todo: { title: '', member: '', dueDate: '' },
    inProgress: { title: '', member: '', dueDate: '' },
    done: { title: '', member: '', dueDate: '' },
  });

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/projects'); // Adjust the URL as needed
        if (response.data.length === 0) {
          setTasks({});
        } else {
          // Assuming the API response data is in the same format as your state
          setTasks(response.data);
        }
      } catch (err) {
        // You can handle the error in some way if needed
        console.error('Failed to load projects:', err);
        setTasks({});
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Function to handle new task input changes
  const handleInputChange = (column, e) => {
    const { name, value } = e.target;
    setNewTasks((prevState) => ({
      ...prevState,
      [column]: { ...prevState[column], [name]: value },
    }));
  };

  // Function to handle task creation for a specific column
  const createTask = (column) => {
    const newTaskObj = {
      id: Date.now(),
      title: newTasks[column].title || 'New Task',
      member: newTasks[column].member || 'Unassigned',
      dueDate: newTasks[column].dueDate || '2024-08-25',
    };

    setTasks((prevState) => ({
      ...prevState,
      [column]: [...prevState[column], newTaskObj],
    }));

    // Reset new task input fields for that column
    setNewTasks((prevState) => ({
      ...prevState,
      [column]: { title: '', member: '', dueDate: '' },
    }));
  };

  // Function to handle task deletion
  const handleDelete = (column, taskId) => {
    setTasks((prevState) => ({
      ...prevState,
      [column]: prevState[column].filter((task) => task.id !== taskId),
    }));
  };

  // If loading, show a loading message
  if (loading) {
    return <div className="min-h-screen p-4 text-white">Loading...</div>;
  }

  // Show message if no tasks are available
  if (tasks && Object.keys(tasks).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white">
        <header className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">Project: Website Redesign</h1>
          <p className="mt-2 text-lg">Description: Complete redesign of the company website to enhance user experience and performance.</p>
          <button className="mt-4 p-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 transition duration-200">Project Settings</button>
        </header>
        <main className="mt-8">
          <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg">
            <p>No projects available.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white">
      {/* Project Header */}
      <header className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Project: Website Redesign</h1>
        <p className="mt-2 text-lg">Description: Complete redesign of the company website to enhance user experience and performance.</p>
        <button className="mt-4 p-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 transition duration-200">Project Settings</button>
      </header>

      {/* Kanban Board */}
      <main className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(tasks).map((column) => (
          <div key={column} className="bg-white text-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold capitalize mb-4">{column.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
            <ul>
              {tasks[column].map((task) => (
                <li key={task.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-200">
                  <h4 className="text-lg font-bold">{task.title}</h4>
                  <p className="text-sm text-gray-600">Assigned to: {task.member}</p>
                  <p className="text-sm text-gray-600">Due Date: {task.dueDate}</p>
                  <div className="flex justify-center mt-2">
                    <button onClick={() => handleDelete(column, task.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* New Task Input Fields */}
            <div className="mt-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={newTasks[column].title}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="member"
                placeholder="Assigned Member"
                value={newTasks[column].member}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                name="dueDate"
                placeholder="Due Date"
                value={newTasks[column].dueDate}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
            </div>
            {/* Create New Task Button for Each Column */}
            <div className="flex justify-center mt-4">
              <button onClick={() => createTask(column)} className="p-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 transition duration-200">
                + Create New Task in {column.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ProjectPage;
