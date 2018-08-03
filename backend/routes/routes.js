const express = require('express');
const models = require('../models/models');
const { Artist, User, Event } = require('../models/models')
const router = express.Router();
const app = express();

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
  const event = new Event({
    eventName: req.body.eventName,
    eventCreator: req.body.eventCreator,
    eventOrganizer: req.body.eventOrganizer,
    venueName: req.body.venueName,
    date: req.body.date,
    time: req.body.time,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
  })
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
});

module.exports = router;
