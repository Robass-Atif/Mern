const Project = require('../Models/projectModel');
const Task = require('../Models/taskModel');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = new Project({
      title,
      description,
      tasks // Array of task IDs
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('tasks'); 
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('tasks');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a project by ID
const updateProjectById = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, tasks },
      { new: true } // Return the updated document
    ).populate('tasks');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project by ID
const deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a task to a project
const addTaskToProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tasks.push(taskId);
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove a task from a project
const removeTaskFromProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tasks = project.tasks.filter(task => task.toString() !== taskId);
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  addTaskToProject,
  removeTaskFromProject
};
