import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.model.js";

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy (only if credentials are configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user information from Google profile
          const email = profile.emails[0].value;
          const googleId = profile.id;
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const avatar = profile.photos[0]?.value;

          // Check if user exists with this Google ID
          let user = await User.findByGoogleId(googleId);

          if (user) {
            // User exists with this Google ID - login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Check if user exists with this email
          user = await User.findByEmail(email);

          if (user) {
            // User exists with this email but different auth provider
            // Link the Google account to existing user
            if (!user.googleId) {
              user.googleId = googleId;
              user.connectedAccounts.push({
                provider: "google",
                providerId: googleId,
                email: email,
                connectedAt: new Date(),
              });

              // Update avatar if not set
              if (!user.avatar && avatar) {
                user.avatar = avatar;
              }

              user.lastLogin = new Date();
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            avatar,
            authProvider: "google",
            googleId,
            isEmailVerified: true, // Google emails are pre-verified
            lastLogin: new Date(),
          });

          return done(null, newUser);
        } catch (error) {
          console.error("Google OAuth Error:", error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
  );
}

// Facebook OAuth Strategy (only if credentials are configured)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL || "/api/auth/facebook/callback",
        profileFields: ["id", "emails", "name", "picture.type(large)"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user information from Facebook profile
          const email = profile.emails?.[0]?.value;
          const facebookId = profile.id;
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const avatar = profile.photos?.[0]?.value;

          // Facebook email is not always available
          if (!email) {
            return done(
              new Error(
                "Unable to retrieve email from Facebook. Please ensure email permissions are granted."
              ),
              null
            );
          }

          // Check if user exists with this Facebook ID
          let user = await User.findByFacebookId(facebookId);

          if (user) {
            // User exists with this Facebook ID - login
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Check if user exists with this email
          user = await User.findByEmail(email);

          if (user) {
            // User exists with this email but different auth provider
            // Link the Facebook account to existing user
            if (!user.facebookId) {
              user.facebookId = facebookId;
              user.connectedAccounts.push({
                provider: "facebook",
                providerId: facebookId,
                email: email,
                connectedAt: new Date(),
              });

              // Update avatar if not set
              if (!user.avatar && avatar) {
                user.avatar = avatar;
              }

              user.lastLogin = new Date();
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            avatar,
            authProvider: "facebook",
            facebookId,
            isEmailVerified: true, // Facebook emails are pre-verified
            lastLogin: new Date(),
          });

          return done(null, newUser);
        } catch (error) {
          console.error("Facebook OAuth Error:", error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  Facebook OAuth not configured. Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in .env"
  );
}

export default passport;
