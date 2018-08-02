const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const artistSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true,
    enum: ['music', 'art', 'theater']
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordRepeat: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  existingWork: {
    type: String,
    required: true
  },
  bio: String,
  facebook: String,
  instagram: String,
  snapchat: String,
  twitter: String,
  tags: Array
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  passwordRepeat: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
});

const eventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  eventCreator: {
    type: String,
    required: true
  },
  eventOrganizer: {
    type: String,
    required: true
  },
  venueName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  latitude: String,
  longitude: String,
  tags: Array,
  description: String,
});

const Artist = mongoose.model('Artist', artistSchema);
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Artist,
  User,
  Event
};
