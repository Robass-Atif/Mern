const express = require('express');
const router = express.Router();
const User = require('../Models/userModel'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure this is set in your environment

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/google', async (req, res) => {
  const { tokenId } = req.body;  // Use tokenId here

  console.log('Received Google token:', tokenId);  // Confirm token is received
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,  // Use tokenId here
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name,
        email,
        googleId,
        // Optionally, you can set a default password or handle it in another way
      });
      await user.save();
    }

    // Create and send JWT token
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ success: true, token: authToken });
  } catch (error) {
    console.error('Google authentication error:', error);  // Log detailed error
    res.status(400).json({ success: false, message: 'Google authentication failed' });
  }
});


module.exports = router;
