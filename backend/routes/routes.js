const express = require('express');
const models = require('../models/models');
const { Artist, User, Event } = require('../models/models')
const router = express.Router();
const app = express();
const validator = require('express-validator');

router.use(validator());

// router.get('/map', (req, res) => {
//   if (!req.user || !req.artist) {
//     console.log('error');
//   } else if (req.user) {
//   res.send(req.user)
// } else if (req.artist) {
//   res.send(req.artist)
// }
// });

router.post('/event/create', (req, res) => {

  req.checkBody("eventName", "Enter event name").notEmpty();
  req.checkBody("venueName", "Enter venue name").notEmpty();
  req.checkBody("date", "Enter date").notEmpty();
  req.checkBody("date", "Date must be in the future").isAfter();
  req.checkBody("time", "time").notEmpty();
  req.checkBody("streetAddress", "Enter street address").notEmpty();
  req.checkBody("city", "Enter city").notEmpty();
  req.checkBody("state", "Enter state").notEmpty();
  req.checkBody("country", "Enter country").notEmpty();
  req.checkBody("city", "Enter city").notEmpty();

    const event = new Event({
      eventName: req.body.eventName,
      eventCreator: req.user._id,
      venueName: req.body.venueName,
      date: req.body.date,
      time: req.body.time,
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      about: req.body.about
    })

  const errors = req.validationErrors();
  if (errors) {
    res.status(400).send(errors)
    return;
  } else {
    event.save((err, event) => {
      if (err) {
        console.log('error', err);
      }
      console.log('event created', event);
      res.json({
        success: true,
        event: event
      });
    })
  }
});

//send connection invite
router.post('/connect', (req, res) => {
  Artist.findOne({username: req.body.username}), (err, artist) => {
    const connection = new Connection({
      requester: req.user._id,
      invitee: req.body.invitee,
    })
    connection.save((err, connection) => {
      if (err) {
        console.log('error', err);
      }
      console.log('connection invite sent', connection);
      res.json({
        success: true,
        connection: connection
      })
    })
  }
});

//accept connection invite
router.post('/accept', (req, res) => {
  Connection.findByIdAndUpdate(id, (err, connection) => {

  })
});

//decline connection invite
router.post('/decline', (req, res) => {
  Connection.findByIdAndRemove(id, (err, connection) => {

  })
});

module.exports = router;
