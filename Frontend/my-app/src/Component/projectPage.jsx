import React, { useState } from 'react';
import axios from 'axios';

const ProjectPage = ({ project, tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTasks, setNewTasks] = useState({
    todo: { title: '', member: '', dueDate: '' },
    inProgress: { title: '', member: '', dueDate: '' },
    done: { title: '', member: '', dueDate: '' },
  });

  const handleInputChange = (column, e) => {
    const { name, value } = e.target;
    setNewTasks((prevState) => ({
      ...prevState,
      [column]: { ...prevState[column], [name]: value },
    }));
  };

  const createTask = async (column) => {
    const newTaskObj = {
      id: Date.now(),
      title: newTasks[column].title || 'New Task',
      member: newTasks[column].member || 'Unassigned',
      dueDate: newTasks[column].dueDate || '2024-08-25',
    };

    try {
      // Send the new task to the API
      const response = await axios.post(`http://localhost:5000/api/projects/${project.id}/tasks`, {
        column,
        ...newTaskObj,
      });

      // If the API call is successful, update the tasks state
      if (response.status === 201) {
        setTasks((prevState) => ({
          ...prevState,
          [column]: [...prevState[column], response.data],
        }));
      }

      // Clear the new task input fields
      setNewTasks((prevState) => ({
        ...prevState,
        [column]: { title: '', member: '', dueDate: '' },
      }));
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle error (e.g., display error message)
    }
  };

  const handleDelete = (column, taskId) => {
    setTasks((prevState) => ({
      ...prevState,
      [column]: prevState[column].filter((task) => task.id !== taskId),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-800">
      <header className="bg-white p-4 shadow rounded-lg">
        <h1 className="text-2xl font-bold">Project: {project?.name || 'Unnamed Project'}</h1>
        <p className="mt-2 text-lg">{project?.description || 'No description available'}</p>
        <button className="mt-4 p-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 transition duration-200">Project Settings</button>
      </header>

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

export async function getServerSideProps(context) {
  const { projectId } = context.params;

  const projectResponse = await axios.get(`http://localhost:5000/projects/${projectId}`);
  const tasksResponse = await axios.get(`http://localhost:5000/projects/${projectId}/tasks`);

  return {
    props: {
      project: projectResponse.data,
      tasks: tasksResponse.data,
    },
  };
}
