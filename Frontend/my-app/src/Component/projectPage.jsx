import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const ProjectPage = () => {






  const { title } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [projectId, setProjectId] = useState(""); // Store project ID
  const[userId, setUserId] = useState("");
  const [projectDescription, setProjectDescription] = useState(""); // Store project description
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });



  // const getId = async () => {

  //   const res=await axios.post('http://localhost:5000/api/users/user', {
  //     email: email,
    
  //   });
  //   console.log(res.data);
  //   setUserId(res.data._id);
    
  //   };




  const [newTasks, setNewTasks] = useState({
    todo: { title: '', member: '', dueDate: '' },
    inProgress: { title: '', member: '', dueDate: '' },
    done: { title: '', member: '', dueDate: '' },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${title}`);
        
        if (!response.ok) {
          throw new Error('Project not found');
        }
  
        const data = await response.json();
        console.log('Fetched Data:', data);
  
        // Assuming data contains both project and tasks
        const { project, tasks } = data;
        console.log('Project:', project);
          setUserId(project.User);
        // Update project state
        setProjectId(project._id);
        setProjectDescription(project.description || 'No description available');
  
        // Organize tasks by their status
        const tasksByStatus = tasks.reduce((acc, task) => {
          const status = task.status.toLowerCase(); // Ensure the status is in lowercase
          if (!['todo', 'inprogress', 'done'].includes(status)) {
            console.warn(`Unknown status: ${status}`);
            return acc; // Skip tasks with unknown status
          }
          // Map status to the correct format
          const formattedStatus = status === 'inprogress' ? 'inProgress' : status;
          if (!acc[formattedStatus]) {
            acc[formattedStatus] = [];
          }
          acc[formattedStatus].push(task);
          return acc;
        }, { todo: [], inProgress: [], done: [] });
  
        setTasks(tasksByStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project or tasks:', error);
        setProjectId(""); // Reset project ID
        setProjectDescription('No description available');
        setTasks({ todo: [], inProgress: [], done: [] });
        setLoading(false);
      }
    };
  
    fetchData();
  }, [title]);

  const handleInputChange = (column, e) => {
    const { name, value } = e.target;
    setNewTasks(prevState => ({
      ...prevState,
      [column]: { ...prevState[column], [name]: value },
    }));
  };

  const createTask = async (column) => {
    if (!projectId) return; // Ensure projectId is set

    const newTaskObj = {
      text: newTasks[column].title || 'New Task',
      assignedTo: newTasks[column].member || 'Unassigned',
      dueDate: newTasks[column].dueDate || '2024-08-25',
      status: column, // Use the column name as the task status
      project: projectId, // Send project ID to the backend
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskObj),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prevState => ({
          ...prevState,
          [column]: [...prevState[column], newTask],
        }));
        setNewTasks(prevState => ({
          ...prevState,
          [column]: { title: '', member: '', dueDate: '' },
        }));
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (column, taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(prevState => ({
          ...prevState,
          [column]: prevState[column].filter(task => task._id !== taskId),
        }));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleBackToDashboard = async () => {
    try {
      // Fetch the user data
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'GET',
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      // Parse the JSON response
      const data = await response.json();
      
      // Check if the email is available in the response
      if (data.email) {
        // Navigate to the Dashboard page with email
        navigate('/dashboard', { state: { email: data.email } });
      } else {
        console.error('Email not found in response data.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Optionally, set a message for the user
      // setMessage('Failed to fetch user data. Please try again.');
    }
  };
  

  if (loading) {
    return <p className="text-gray-600">Loading project details...</p>;
  }

  const taskColumns = ['todo', 'inProgress', 'done'];

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-800">
      <header className="bg-white p-4 shadow rounded-lg">
        <h1 className="text-2xl font-bold">Project: {title || 'Unnamed Project'}</h1>
        <p className="mt-2 text-lg">{projectDescription}</p>
      </header>

      <main className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {taskColumns.map((column) => (
          <div key={column} className="bg-white text-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold capitalize mb-4">{column.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
            <ul>
              {tasks[column] && tasks[column].length > 0 ? (
                tasks[column].map((task) => (
                  <li key={task._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-200">
                    <h4 className="text-lg font-bold">{task.text}</h4>
                    <p className="text-sm text-gray-600">Assigned to: {task.assignedTo || 'Unassigned'}</p>
                    <p className="text-sm text-gray-600">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <div className="flex justify-center mt-2">
                      <button onClick={() => handleDelete(column, task._id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500">No tasks available</li>
              )}
            </ul>
            <div className="mt-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={newTasks[column].title || ''}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="member"
                placeholder="Assigned Member"
                value={newTasks[column].member || ''}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                type="date"
                name="dueDate"
                placeholder="Due Date"
                value={newTasks[column].dueDate || ''}
                onChange={(e) => handleInputChange(column, e)}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={() => createTask(column)} className="p-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 transition duration-200">
                + Create New Task in {column.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </button>
            </div>
          </div>
        ))}
      </main>

      <div className="mt-8 text-center">
        <button onClick={handleBackToDashboard} className="p-2 bg-gray-600 text-white rounded shadow-lg hover:bg-gray-700 transition duration-200">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;