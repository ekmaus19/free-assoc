const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const artistSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  existingWork: {
    type: Array,
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
    required: true
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
    required: true
  },
});

const eventSchema = mongoose.Schema({
  eventName: {
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
  tags: Array
})
