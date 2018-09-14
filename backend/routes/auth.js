import express from 'express';
const router = express.Router();
var multer  = require('multer')
const models = require('../models/models');
const validator = require('express-validator');
const uuidv4 = require('uuid/v4');
const path = require('path');
var fs = require('fs');

const upload =multer({dest:'uploads/'})

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
    user.save(err => {
      if (err) {
        if (err.code) {
          res.json({success: false, errors: ["This email is already registered. Please log in"]})
        } else {
          res.json({success: false, errors: err.error});
        }
      } else {
        console.log('saved!!', user);
        res.json({
          success: true,
          user: user
        });
      }
    });
  }
});

//conflicting usernames?
router.post('/register/artist', upload.single('selectedFile'),(req, res) => {
  console.log('artist******', req.file,req.body)

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


  let readFile;
  if (req.file){
    readFile = fs.readFileSync(req.file.path)
  } else {
    readFile = null;
  }

  var info = JSON.parse(req.body.info)
  console.log("INFO ", info)
  const artist = new models.Artist({
      firstName: info.firstName,
      lastName: info.lastName,
      medium: info.medium,
      username: info.username,
      password: info.password,
      passwordRepeat: info.passwordRepeat,
      email: info.email,
      phone: info.phone,
      existingWork: info.existingWork,
      bio: info.bio,
      img: {data:readFile, contentType:'image/png'}
  })
  console.log("ARTIST IS ", artist)
  artist.save(((err)=>{
    if(err){
      res.json({success: false, errors: err.errors})
    } else {
      res.json({success:true, artist:artist})
    }
  }))
  // artist.save()
  //   .then((saved) => {
  //     console.log("successfully saved: ", saved)
  //     res.json({success:true, artist: saved})
  //   })
  //   .catch((err) => {
  //     console.log("ERR ", err)
  //   })


    // .save(((err,event)=>{
    //   if(err === req.validationErrors()){
    //     console.log(err)
    //   } else{
    //     console.log('saved')
    //     res.json({success:true, artist:artist})
    //   }
    // })
    // )
  })


    // router.post('/register/artist', upload.single('selectedFile'),(req, res) => {
    //   console.log('artist******', req.file)

    //   req.checkBody("email", "Enter a valid email address").isEmail();
    //   req.checkBody("firstName", "Enter first name").notEmpty();
    //   req.checkBody("lastName", "Enter last name").notEmpty();
    //   req.checkBody("email", "Enter email address").notEmpty();
    //   req.checkBody("medium", "Enter medium").notEmpty();
    //   req.checkBody("username", "Enter username").notEmpty();
    //   req.checkBody("username", "Username must be at least 3 characters").isLength({min:3, max: 20});
    //   req.checkBody("password", "Enter password").notEmpty();
    //   req.checkBody("password", "Password must be at least 5 characters").isLength({min:5, max: 20});
    //   req.checkBody("passwordRepeat", "Repeat password").notEmpty();
    //   req.checkBody("existingWork", "Enter link to sample work").notEmpty();
    //   req.checkBody("existingWork", "Enter valid link").isURL();
    //   req.checkBody("passwordRepeat", "Passwords do not match").equals(req.body.password);

    //   var readFile = fs.readFileSync(req.file.path)
    //   var info = JSON.parse(req.body.info)
    //   new models.Artist({
    //       firstName: req.body.firstName,
    //       lastName: req.body.lastName,
    //       medium: req.body.medium,
    //       username: req.body.username,
    //       password: req.body.password,
    //       passwordRepeat: req.body.passwordRepeat,
    //       email: req.body.email,
    //       existingWork: req.body.existingWork,
    //       bio: req.body.bio,
    //       img: {data:readFile, contentType:'image/png'}
    //     }).save(((err,event)=>{
    //       if(err === req.validationErrors()){
    //         console.log(err)
    //       } else{
    //         console.log('saved')
    //         res.json({success:true, artist:artist})
    //       }
    //     })
    //   )
    //   })



    router.post('/login/user', passport.authenticate('user'), (req, res) => {
      req.session.user = req.user; //sets current user
      console.log("User", req.session)
      res.json({
        success: true,
        user: req.user,
      });
      console.log('user logged in');
    });

    router.post('/login/artist', passport.authenticate('artist'), (req, res) => {
      console.log('****', req.user)
      // req.session.user = req.user; //sets current user
      // console.log("Artist", req.session)
      res.json({
        success: true,
        artist: req.user,
      });
      console.log('artist logged in');
    });

    router.get('/logout', (req, res) => {
      req.logout();
      res.send(true)
      console.log('logged out')
    });

    return router;
  };
