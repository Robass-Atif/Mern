// const passport = require('passport');
// const { generateJWT } = require('../Controllers/userControllers')
// const { requestPasswordReset, resetPassword } = require('../controllers/authController'); 

// const router = require('express').Router(); // Create a new router using express.Router() method.

// router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
// router.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//       // Generate JWT for the authenticated user
//       const token = req.user ? generateJWT(req.user._id) : null;

//     if (token) {
//         res.json({ token });
//     }

//     res.redirect('/');
//     }
//   ); // This route will be used to authenticate the user using Facebook. We use the passport.authenticate method to authenticate the user using the Facebook strategy we defined in the passport.js file. IF failure, redirect to /login. If success, redirect to /profile with the JWT token as a query parameter.

// router.post('/forgot-password', requestPasswordReset);

//   // Route to reset the password
// router.post('/reset-password/:token', resetPassword);


// module.exports = router; // Export the router object.
