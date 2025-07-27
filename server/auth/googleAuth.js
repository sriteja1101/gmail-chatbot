const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      accessToken,
      refreshToken // Store refresh token for API access
    };
    done(null, user);
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};