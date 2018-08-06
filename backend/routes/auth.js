import express from 'express';

const router = express.Router();
const models = require('../models/models');
const validator = require('express-validator');

router.use(validator());

module.exports = (passport) => {

  router.post('/register/user', (req, res) => {

    req.checkBody("email", "Enter a valid email address").isEmail();
    req.checkBody("email", "Enter email address").notEmpty();
    req.checkBody("username", "Enter username").notEmpty();
    req.checkBody("username", "Username must be at least 3 characters").isLength({min:3, max: 20});
    req.checkBody("password", "Enter password").notEmpty();
    req.checkBody("password", "Password must be at least 5 characters").isLength({min:5, max: 20});
    req.checkBody("passwordRepeat", "Repeat password").notEmpty();
    req.checkBody("passwordRepeat", "Passwords do not match").equals(req.body.password);

    const user = new models.User({
      username: req.body.username,
      password: req.body.password,
      passwordRepeat: req.body.passwordRepeat,
      email: req.body.email,
    });

  const errors = req.validationErrors();
  if (errors) {
    res.status(400).send(errors)
    return;
  } else {
    user.save((err, user) => {
      if (err) {
        console.log(err);
      }
      console.log(user);
      res.json({
        success: true,
        user: user
      });
    })
  }
});

    router.post('/register/artist', (req, res) => {

      req.checkBody("email", "Enter a valid email address").isEmail();
      req.checkBody("firstName", "Enter first name").notEmpty();
      req.checkBody("lastName", "Enter last name").notEmpty();
      req.checkBody("email", "Enter email address").notEmpty();
      req.checkBody("medium", "Enter medium").notEmpty();
      req.checkBody("username", "Enter username").notEmpty();
      req.checkBody("username", "Username must be at least 3 characters").isLength({min:3, max: 20});
      req.checkBody("password", "Enter password").notEmpty();
      req.checkBody("password", "Password must be at least 5 characters").isLength({min:5, max: 20});
      req.checkBody("passwordRepeat", "Repeat password").notEmpty();
      req.checkBody("existingWork", "Enter link to sample work").notEmpty();
      req.checkBody("existingWork", "Enter valid link").isURL();
      req.checkBody("passwordRepeat", "Passwords do not match").equals(req.body.password);

        const artist = new models.Artist({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          medium: req.body.medium,
          username: req.body.username,
          password: req.body.password,
          passwordRepeat: req.body.passwordRepeat,
          email: req.body.email,
          existingWork: req.body.existingWork,
          bio: req.body.bio
        });

        const errors = req.validationErrors();
        if (errors) {
          res.status(400).send(errors)
          return;
        } else {
        artist.save((err, artist) => {
          if (err) {
            console.log(err);
          }
          console.log(artist);
          res.json({
            success: true,
            artist: artist
          });
        })
      }
    });

    router.post('/login/user', passport.authenticate('user'), (req, res) => {
      console.log('user logged in');
      res.json({
        success: true,
        user: req.user,
      });
    });

    router.post('/login/artist', passport.authenticate('artist'), (req, res) => {
      console.log('artist logged in');
      res.json({
        success: true,
        artist: req.user,
      });
    });

    router.get('/logout', (req, res) => {
      req.logout();
      console.log('logged out')
    });

    return router;
  };
