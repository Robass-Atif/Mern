const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/userModel');

// Generate JWT token
const generateJWT = (id) => jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_secret_key", // Use environment variable or a default secret key
    { expiresIn: '5d' }
);

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are mandatory' });
      return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
      res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateJWT(user._id),
          success: true
      });
  } else {
      res.status(400).json({ message: 'Invalid user data' });
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
      res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateJWT(user._id),
          success: true
      });
  } else {
      res.status(400).json({ message: 'Invalid email or password', success: false });
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const { email } = req.body; // Use req.body for POST request
  console.log(email);


  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    // console.log(user);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }


    // now send the response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Update Username
const updateUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update the username if provided
    if (username) {
      user.username = username;
    }

    // Update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to update user');
  }

  
  
});

// Update Password
const updatePassword = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
});

module.exports = { registerUser, loginUser, getCurrentUser, updatePassword, updateUser };
