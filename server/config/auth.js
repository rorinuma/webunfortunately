const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        };

        const existingUser = await userModel.findUserGoogle(user.googleId);

        if (existingUser.length > 0) {
          return done(null, existingUser[0]);
        }

        await userModel.createUserGoogle(
          user.email,
          user.username,
          user.googleId
        );

        const newUser = await userModel.findUserGoogle(user.googleId);

        return done(null, newUser[0]);
      } catch (error) {
        console.error("error uwu uwu owo", error);
        done(error, null);
      }
    }
  )
);
