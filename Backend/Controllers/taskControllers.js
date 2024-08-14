const asyncHandler = require("express-async-handler"); // Import express-async-handler module.
const Task = require("../Models/taskModel"); // Import the Task model.
const User = require("../Models/userModel"); // Import the User model.

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }); // Find tasks in the database of the logged-in user.
  res.status(200).json(tasks); // Send a JSON response with the tasks.
});

const createTask = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please enter a task");
  }
  const task = await Task.create({
    text: req.body.text,
    user: req.user.id,
    status: req.body.status,
    dueDate: req.body.dueDate
  }); // Create a new task in the database.
  res.status(201).json(task); // Send a JSON response with the created task.
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id); // Find the task by id.
  if (!task) {
    res.status(404);
    // throw new Error("Task not found");
  }

  const user = await User.findById(req.user.id); // Find the user by id.
  if (!user) {
    res.status(401);
    // throw new Error("User not found");
  }

  if (task.user.toString() !== user.id) {
    res.status(401);
    // throw new Error("Not authorized to update");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the task in the database.
  res.status(200).json(updatedTask); // Send a JSON response with the updated task.
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id); // Find the task by id.
  if (!task) {
    res.status(404);
    // throw new Error("Task not found");
  }

  const user = await User.findById(req.user.id); // Find the user by id.
  if (!user) {
    res.status(401);
    // throw new Error("User not found");
  }

  if (task.user.toString() !== user.id) {
    res.status(401);
    // throw new Error("Not authorized to delete");
  }

  await Task.findByIdAndDelete(req.params.id); // Delete the task from the database.
  res.status(200).json({ id: req.params.id }); // Send a JSON response with the id of the deleted task.
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id); // Find the task by id.
  if (!task) {
    res.status(404);
    // throw new Error("Task not found");
  }

  task.status = req.body.status; // Update the status of the task.
  await task.save(); // Save the updated task in the database.
  res.status(200).json(task); // Send a JSON response with the updated task.
});


module.exports = { getTasks, createTask, updateTask, deleteTask, updateTaskStatus };
// Export the functions.
