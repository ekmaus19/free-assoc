const express = require('express');
const models = require('../models/models');
const bodyParser = require('body-parser');
const { Artist, User, Event, Connection } = require('../models/models')
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

router.get('/artist/:id/profileimg',(req,res)=>{
  Artist.findById(req.params.id, (err,event)=>{
    res.contentType(event.img.contentType)
    res.end(event.img.data, "binary")
  })
})

router.get('/contacts/:id/profileimg',(req,res)=>{
  Artist.findById(req.params.id, (err,event)=>{
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

//get contact list
router.get('/contacts/:userId', (req, res) => {
  const contacts = []
  Artist.findById(req.params.userId)
  .populate('connections')
  .exec((err, artist) => {
    if (err) {
      res.send('Error')
    } else {
      res.json({contacts: artist.connections})
    }
  })
});

//get sent invites
router.get('/pending/sent/:userId', (req, res) => {
  Connection.find({requester: req.params.userId})
  .populate('invitee')
  .exec( (err, connection) => {
    if (err) {
      console.log(err)
    }
    console.log(connection)
    const sent = connection.filter((item) => {
      if (item.status === 'pending') {
        return true
      } else {
        return false
      }
    })
    res.json({sent: sent})
  })
});

//get received invites
router.get('/pending/received/:userId', (req, res) => {
  Connection.find({invitee: req.params.userId})
  .populate('requester')
  .exec( (err, connection) => {
    if (err) {
      console.log(err)
    }
    console.log(connection)
    const received = connection.filter((item) => {
      if (item.status === 'pending') {
        return true
      } else {
        return false
      }
    })
    res.json({received: received})
  })
});

// send connection invite
router.post('/connect/:userId', (req, res) => {
  console.log('****', req.params.userId)
  Artist.findById(req.params.userId, (err, artist) => {
    if (err) {
      res.send(err)
    } else {
      if (!artist) {
        console.log('Artist does not exist')
        res.send({error: 'Artist does not exist'})
        return
      }
      const connection = new Connection({
        requester: req.params.userId,
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
router.post('/accept/:userId', (req, res) => {
  Connection.findOneAndUpdate({requester: req.body.requester, invitee: req.params.userId}, {status: 'accepted'}, (err, connection) => {
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
});

//decline connection invite
router.post('/decline/:userId', (req, res) => {
  Connection.findOneAndUpdate({requester: req.body.requester, invitee: req.params.userId}, {status: 'declined'}, (err, connection) => {
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

//delete contact
router.post('/delete/:id', (req, res) => {
  console.log(req.params.id,"OMGGGG")

  Artist.findById
  Connection.findByIdAndRemove({_id: req.params.id}, (err, connection) => {
    if (err) {
      res.send(err)
    } else if (connection) {
      res.json({
        success: true,
        connection: connection
      })
    } else {
      res.json({
        success:false
      })
    }
  })
});

//scout artists
router.post('/scout', (req, res) => {
  Artist.find({medium: req.body.medium}, (err, artist) => {
    if (err) {
      res.send(err)
    } else {
      if (!artist) {
        console.log('Artist does not exist')
        res.send({error: 'Artist does not exist'})
        return
      } else {
        res.json({
          success: true,
          artist: artist
        })
      }
    }
  })
});


module.exports = router;
