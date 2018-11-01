import http from 'http';
import express from 'express';
import session from 'express-session';
const validator = require('express-validator');
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';
import socketIO from 'socket.io';
import cors from 'cors';
import { emitKeypressEvents } from 'readline';

const models = require('./models/models');
const { Artist, User, Event, Connection } = require('./models/models')

const routes = require('./routes/routes');
const auth = require('./routes/auth');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {

  console.log('connected--------')
  /////////////////////////////////
  // get latitude and longitude
  // socket.on('createEvent', (data, next) => {
  // //   /// ask about this
  // //   geocoder.search( { q: data.venueName + ', ' + data.streetAddress + ', ' data.city + ', ' + data.state + ', ' + data.country} )
  // //   .then((response) => {
  // //       console.log(response)
  // //   })
  // //   .catch((error) => {
  // //       console.log(error)
  // //   })
  //   /////////////////////////////
  //   console.log('Sweet Jesus it worked',data)
  //   new Event({
  //     eventName: data.eventName,
  //     eventCreator: data.eventCreator,
  //     venueName: data.venueName,
  //     medium: data.medium,
  //     date: data.date,
  //     datesRange: data.datesRange,
  //     time: data.time,
  //     streetAddress: data.streetAddress,
  //     city: data.city,
  //     state: data.state,
  //     country: data.country,
  //     about: data.about,
  //     tags: data.tags.map((tag)=> tag.text)
  //   }).save((err, event) => next({err, event}))
  // })

  socket.on('displayEvents', (data, next) => {
    event.find({}, (err, results) => {
      if(err) console.log("error")
      else {
        for (var i =0; i<results.length; i++) {
          var query = results[i].streetAddress + ', ' + results[i].city + ', ' + results[i].state
          geocoder.search( { q: query } )
              .then((response) => {
                  results[i].latitude = response[0].latitude
                  results[i].longitude = response[0].longitude
              }).save((err, event) => next({err, event}))
              .catch((error) => {
                  console.log(error)
            })
        }
      }
    })
  })

  socket.on('getEvents', (data, next) => {
    Event
    .find({eventCreator: data.userId})
    .select('-img')
    .exec(function(err, events) {

      // events.forEach((i)=> {
      //  i.img.data = null
      // })
      console.log(events[0],'****')
      socket.emit('getEvents',{events})
      })
    })

  });



// socket.on('filterCategory', (data, next) => {
//   Event.find({medium: data.about}, (err, data) => {
//       done(err, data);
//     })
//   })



app.use(session({
  secret: process.env.SECRET,
  name: 'free-assoc',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(cors());
app.use(validator());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://powerful-bastion-26209.herokuapp.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


mongoose.connection.on('connected', () => {
  console.log('connected to mongoDB');
});
mongoose.connect(process.env.MONGODB_URI);


// Passport Serialize
passport.serializeUser((user, done) => {
  if (user) {
  done(null, user.id)
} else if (artist) {
  done(null, artist.id)
}
});

// Passport Deserialize
passport.deserializeUser((id, done) => {
  if (User) {
  User.findById(id, (err, user) => {
    done(err, user);
  })
} else if (Artist) {
  Artist.findById(id, (err, artist) => {
    done(err, artist);
  })
}
});

// Passport User Strategy
passport.use('user', new LocalStrategy (
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  },
));

// Passport Artist Strategy
passport.use('artist', new LocalStrategy (
  (username, password, done) => {
    console.log(username,'******')
    Artist.findOne({ username }, (err, artist) => {
      if (err) { return done(err); }
      if (!artist) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (artist.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      console.log(artist,'#############')
      return done(null, artist);
    });
  },
));

app.use(passport.initialize());
app.use(passport.session());
// Use the session middleware
app.use(session({ secret: 'qwerty', cookie: { maxAge: 60000 }}))


app.use('/', auth(passport));
app.use('/', routes);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/events', function (req, res) {
  console.log("are we there yet")
  Event.find({}).lean().populate("eventCreator", ["username"]).exec((err, results) => {
    if(err) console.log("a terrible horrible error")
    else {
      results = results.map((result) => {
        delete result.img;
        return result;
      })
      res.json(results)
      // return res.json(results)
    }
  })
});

app.post('/filtered-data', function(req, res) {
  Event.find({about: req.body.medium}, (err, results) => {
    if(err) console.log(err);
    else {
      console.log("from backend --------------------->",results)
      return res.json(results)
    }
  })
})

// app.post('/artist', function(req,res) {
//   Artist.find({_id: req.body.sentId}, (err, results) => {
//     if(err) console.log("couldn't locate the artist by id")
//     else { return res.json(results) }
//   })
// })

module.exports = app;

server.listen(process.env.PORT || 1337);

console.log('Server running at https://powerful-bastion-26209.herokuapp.com/')
