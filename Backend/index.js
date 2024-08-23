// Load environment variables from .env file
require('dotenv').config();

// Import modules
const express = require('express');
const connectDB = require('./Connect/database');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const User = require('./Models/userModel');

// Import routes
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Google OAuth credentials
const googleId = process.env.GOOGLE_CLIENT_ID || "697063750023-7nha10stlk2j37gijq3p2kvgbmpmpu9r.apps.googleusercontent.com";
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || "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";

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Use CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://mern-mu-ecru.vercel.app', // Allow requests from frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies and credentials
}));

// Set session
app.use(session({
  secret: process.env.SESSION_SECRET || "sfjjjdlsjasl23",
  resave: false,
  saveUninitialized: true
}));

// Initialize passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: googleId,
  clientSecret: googleSecret,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://mern-mu-ecru.vercel.app/auth/google/callback",
  scope: ["profile", "email"]
},
async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }), function(req, res) {
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});

app.get('/login/success', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User has successfully authenticated",
      data: req.user.email,
      cookies: req.cookies
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User has not authenticated"
    });
  }
});

// Parse incoming JSON requests
app.use(express.json());

// Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
