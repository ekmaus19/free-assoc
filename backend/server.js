import http from 'http';
import express from 'express';
import session from 'express-session';
const validator = require('express-validator');
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';
import socketIO from 'socket.io';
import cors from 'cors';

const models = require('./models/models');
const { Artist, User, Event } = require('./models/models')

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
  socket.on('createEvent', (data, next) => {
  //   /// ask about this
  //   geocoder.search( { q: data.venueName + ', ' + data.streetAddress + ', ' data.city + ', ' + data.state + ', ' + data.country} )
  //   .then((response) => {
  //       console.log(response)
  //   })
  //   .catch((error) => {
  //       console.log(error)
  //   })
    /////////////////////////////
    console.log('Sweet Jesus it worked',data)
    new Event({
      eventName: data.eventName,
      eventCreator: data.eventCreator,
      venueName: data.venueName,
      date: data.date,
      datesRange: data.datesRange,
      time: data.time,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      country: data.country,
      about: data.about
    }).save((err, event) => next({err, event}))
  })

  socket.on('displayEvents', (data, next) => {
    event.find({}, (err, results) => {
      if(err) console.log("error")
      else {
        for (var i =0; i<results.length; i++) {
          var query = results[i].streetAddress + ', ' + results[i].city + ', ' + results[i].state
          geocoder.search( { q: query } )
              .then((response) => {
                  console.log(response)
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

  //get documents
  socket.on('getEvents', (data, next) => {
    Event
    .find({userId: data.userId})
    .exec(function(err, events) {
      next({err, events})
    })

  })

});

// socket.on('filterCategory', (data, next) => {
//   Event.find({about: data.about}, (err, data) => {
//     done(err, data);
//   })
// })

// })

app.use(session({
  secret: process.env.SECRET,
  name: 'free-assoc',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(cors());
app.use(validator());

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
    Artist.findOne({ username }, (err, artist) => {
      if (err) { return done(err); }
      if (!artist) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (artist.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, artist);
    });
  },
));

app.use('/', auth(passport));
app.use('/', routes);

module.exports = app;

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/')
