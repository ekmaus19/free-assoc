import express from 'express';

const router = express.Router();
const models = require('../models/models');

module.exports = (passport) => {

  router.post('/register/user', (req, res) => {

    const validateUser = user => (req.body.password === req.body.passwordRepeat);

    if(validateUser()) {
    const user = new models.User({
      username: req.body.username,
      password: req.body.password,
      passwordRepeat: req.body.passwordRepeat,
      email: req.body.email,
    });

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
} else {
  alert('passwords do not match')
}
});

  router.post('/register/artist', (req, res) => {

    const validateArtist = artist => (req.body.password === req.body.passwordRepeat);

    if (validateArtist()) {
    const artist = new models.Artist({
      name: req.body.name,
      medium: req.body.medium,
      username: req.body.username,
      password: req.body.password,
      passwordRepeat: req.body.passwordRepeat,
      email: req.body.email,
      existingWork: [],
      bio: req.body.bio
    });

    artist.save((err, artist) => {
      if (err) {
        console.log(err);
      }
      console.log(artist);
      res.json({
        success: true,
        user: artist
      });
    })
} else {
  console.log('passwords do not match')
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
      user: req.artist,
    });
  });

  router.get('/logout', (req, res) => {
    req.logout();
  });

  return router;
};
