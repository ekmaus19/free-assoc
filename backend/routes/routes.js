const express = require('express');
const models = require('../models/models');
const bodyParser = require('body-parser');
const { Artist, User, Event, Image } = require('../models/models')
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

router.post('/fileUpload', upload.single('selectedFile'),function(req,res,next){
  console.log('file****', req.file,req.body)
  console.log(req.user);
  var readFile = fs.readFileSync(req.file.path)
  const info = JSON.parse(req.body.info)
  new Event({
      eventName: info.eventName,
      eventCreator: info.eventCreator,
      venueName: info.venueName,
      medium:info.medium,
      date: info.date,
      datesRange: info.datesRange,
      startTime: info.startTime,
      endTime: info.endTime,
      streetAddress: info.streetAddress,
      city: info.city,
      state: info.state,
      country:info.country,
      price: info.price,
      about: info.about,
      tags:info.tags.map((tag)=> tag.text),
      img: {data:readFile,contentType:'image/png'},
      latitude: req.body.latitude,
      longitude: req.body.longitude
  }).save((err,event)=> {
    if (err){
      console.log(err)
    } else{
      console.log('saved')
      res.json({success:true})
    }
  }
  );
})

router.get('/event/:id/profileimg',(req,res)=>{
  Event.findById(req.params.id, (err,event)=>{
    res.contentType(event.img.contentType)
    res.end(event.img.data, "binary")
  })
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
