const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const keys = require("./keys");
var db = require("../models");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findOne({
    where: {
      id: id
    }
  }).then(function(user) {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: "176663177048-46phpc9625ot8krk1qprvqm5fnjgbucq.apps.googleusercontent.com",
      clientSecret: "keys.google.clientSecret"
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // console.log(profile);
      //send the new user to DB from google, cheking if exits first
      db.User.findOne({
        where: {
          googleid: profile.id
        }
      }).then(function(currentUser) {
        if (currentUser) {
          done(null, currentUser);
        } else {
          //checking if it is in the DB without googleid
          db.User.findOne({
            where: {
              email: profile.emails[0].value
            }
          }).then(function(currentUser) {
            if (currentUser) {
              //aperecio por el correo, le agrego el googleid

              db.User.update(
                {
                  googleid: profile.id
                },
                {
                  where: {
                    id: currentUser.id
                  }
                }
              ).then(function(quant) {
                done(null, currentUser);
              });
            } else {
              // db.User.create({
              //   name: profile.displayName,
              //   email: profile.emails[0].value,
              //   googleid: profile.id
              // }).then(function(newUser) {
              //   // console.log("el nuevo user " + newUser.id); //hacer logging
              //   done(null, newUser);
              // });
              return done(null, false);
            }
          });
        }
      });
    }
  )
);

passport.use(
  new LocalStrategy((username, password, done) => {
    // Retrieve a User object from the database using Sequelize
    // by username
    //where: { username: username }
    db.User.findOne({ where: { username: username } }).then(res => {
      //console.log(res);
      // res is the response from Sequelize in the promise
      // If there's no response, give error message
      if (!res) return done(null, false, { message: "Incorrect username" });

      // Content (User object) is in res.dataValues
      let user = res.dataValues;
      // Password in the user.password field is already hashed. Store in variable hash
      let hash = user.password;
      // Compare the password (using the hash in session)
      bcrypt.compare(password, hash, (err, res) => {
        // res is the results of the comparison (true or false)
        if (err) return done(err);
        if (res) {
          //console.log(user);

          usernamed = user.username;
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);
