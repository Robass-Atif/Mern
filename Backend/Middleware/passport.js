const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.Google_CLIENT_ID,
    clientSecret: process.env.Google_CLIENT_SECRET,
    callbackURL: process.env.Google_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: "null" // Since Facebook users don't need a password.
        });
        return done(null, newUser); 
      }
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
}); 

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
