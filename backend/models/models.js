const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const artistSchema = mongoose.Schema({
  img: {
    data:Buffer,
    contentType:String,
  },
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
    enum: ['music', 'art', 'performance']
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
  phone:{
    type: Number,
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
  twitter: String,
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  }],
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
  img: {
    data:Buffer,
    contentType:String,
  },
  eventName: {
    type: String,
    required: true
  },
  eventCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  medium: {
    type: String,
    required: true,
    enum: ['music', 'art', 'performance']
  },
  venueName: {
    type: String,
    required: true
  },
  datesRange: {
    type: String,
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  streetAddress: {
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
  about: String,
  price:{
    type:String,
    required:true
  }
});

const connectionSchema = mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
});

const Artist = mongoose.model('Artist', artistSchema);
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Connection = mongoose.model('Connection', connectionSchema);

module.exports = {
  Artist,
  User,
  Event,
  Connection,
};
