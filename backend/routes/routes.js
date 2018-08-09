const express = require('express');
const models = require('../models/models');
const bodyParser = require('body-parser');
const { Artist, User, Event, Image, Connection } = require('../models/models')
const router = express.Router();
const app = express();
const validator = require('express-validator');
var multer  = require('multer')
const uuidv4 = require('uuid/v4');
const path = require('path');
var fs = require('fs');

 // configure storage

 const upload =multer({dest:'uploads/'})


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(validator());

router.post('/fileUpload', upload.array('selectedFile','info','longitude','latitude'),function(req,res,next){
  console.log('file****', req.files,req.body)
  const info = JSON.parse(req.body.info)
  new Event({
      eventName: info.eventName,
      eventCreator: info.eventCreator,
      venueName: info.venueName,
      medium:info.medium,
      date: info.date,
      datesRange: info.datesRange,
      time: info.time,
      streetAddress: info.streetAddress,
      city: info.city,
      state: info.state,
      country:info.country,
      about: info.about,
      tags:info.tags.map((tag)=> tag.text),
      img: {data:req.file,contentType:'image/png'},
      latitude: req.body.latitude,
      longitude: req.body.longitude
  }).save((err,event)=> {
    console.log('saved')
    res.json({success:true})
  }
  );
})



// router.post('/event/create', (req, res) => {

//   req.checkBody("eventName", "Enter event name").notEmpty();
//   req.checkBody("venueName", "Enter venue name").notEmpty();
//   req.checkBody("date", "Enter date").notEmpty();
//   req.checkBody("date", "Date must be in the future").isAfter();
//   req.checkBody("time", "time").notEmpty();
//   req.checkBody("streetAddress", "Enter street address").notEmpty();
//   req.checkBody("city", "Enter city").notEmpty();
//   req.checkBody("state", "Enter state").notEmpty();
//   req.checkBody("country", "Enter country").notEmpty();
//   req.checkBody("city", "Enter city").notEmpty();

//     const event = new Event({
//       eventName: req.body.eventName,
//       eventCreator: req.user._id,
//       venueName: req.body.venueName,
//       date: req.body.date,
//       time: req.body.time,
//       streetAddress: req.body.streetAddress,
//       city: req.body.city,
//       state: req.body.state,
//       country: req.body.country,
//       about: req.body.about
//     })

//   const errors = req.validationErrors();
//   if (errors) {
//     res.status(400).send(errors)
//     return;
//   } else {
//     event.save((err, event) => {
//       if (err) {
//         console.log('error', err);
//       }
//       console.log('event created', event);
//       res.json({
//         success: true,
//         event: event
//       });
//     })
//   }
// });

// send connection invite
router.post('/connect', (req, res) => {
  Artist.findOne({username: req.body.username}, (err, artist) => {
    if (err) {
      res.send(err)
    } else {
    const connection = new Connection({
      requester: "5b62233284dd7663147a4ff3",
      invitee: artist._id,
    })
    connection.save((err, connection) => {
      if (err) {
        console.log('error', err);
        res.send(error)
      } else {
      console.log('connection invite sent', connection);
      res.json({
        success: true,
        connection: connection
      })
    }
    })
  }
})
});

//accept connection invite
router.post('/accept/:id', (req, res) => {
  Connection.findByIdAndUpdate(req.params.id, {status: 'accepted'}, (err, connection) => {
    if (err) {
      res.send(err)
    } else {
    Artist.findById(connection.requester, (err, artist) => {
      artist.connections.push(connection.invitee)
      artist.save((err, artist) => {
        Artist.findById(connection.invitee, (err, artist) => {
          artist.connections.push(connection.requester)
          artist.save((err, artist) => {
            res.json({
              success: true,
              connection: connection
            })
          })
        })
    })
  })
}
})
})

//decline connection invite
router.post('/decline/:id', (req, res) => {
  Connection.findByIdAndUpdate(req.params.id, {status: 'declined'}, (err, connection) => {
    if (err) {
      res.send(err)
    } else {
    res.json({
      success: true,
      connection: connection
    })
  }
  })
});



module.exports = router;
