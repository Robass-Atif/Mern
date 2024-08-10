import React, { useState } from 'react';

const ProjectPage = () => {
  // Example state to manage tasks
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Design Homepage', member: 'Alice', dueDate: '2024-08-15' },
    ],
    inProgress: [
      { id: 2, title: 'Develop API', member: 'Bob', dueDate: '2024-08-20' },
    ],
    done: [
      { id: 3, title: 'Set Up Database', member: 'Charlie', dueDate: '2024-08-10' },
    ],
  });

  // Function to handle task creation (for simplicity, adds a task to the 'To Do' column)
  const createTask = () => {
    const newTask = { id: Date.now(), title: 'New Task', member: 'David', dueDate: '2024-08-25' };
    setTasks((prevState) => ({
      ...prevState,
      todo: [...prevState.todo, newTask],
    }));
  };

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
                  <div className="flex space-x-2 mt-2">
                    <button className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200">Edit</button>
                    <button className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      {/* Create New Task Button */}
      <div className="flex justify-center mt-8">
        <button onClick={createTask} className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition duration-200">
          + Create New Task
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;
