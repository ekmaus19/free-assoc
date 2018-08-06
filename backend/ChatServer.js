// import http from 'http';
// import express from 'express';
// import session from 'express-session';
// import socketIO from 'socket.io';
//
// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);
//
// const auth = require('./routes/auth');
// const path = require('path');
// const MongoStore = require('connect-mongo')(session);
// const mongoose = require('mongoose');
//
// // Default routes
// const publicPath = path.join(__dirname, 'public');
// app.use(express.static(publicPath));
// app.use(compress());
//
// app.get('/', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });
//
// // Socket handler
// io.on('connection', socket => {
//   console.log('connected to chat socket');
//
//   socket.on('username', username => {
//     if (!username || !username.trim()) {
//       return socket.emit('errorMessage', 'No username!');
//     }
//     socket.username = String(username);
//   });
//
//   socket.on('room', requestedRoom => {
//     if (!socket.username) {
//       return socket.emit('errorMessage', 'Username not set!');
//     }
//     if (!requestedRoom) {
//       return socket.emit('errorMessage', 'No room!');
//     }
//     if (socket.room) {
//       socket.leave(socket.room);
//     }
//     socket.room = requestedRoom;
//     socket.join(requestedRoom, () => {
//       socket.to(requestedRoom).emit('message', {
//         username: 'System',
//         content: `${socket.username} has joined`
//       });
//     });
//   });
//
//   socket.on('message', message => {
//     if (!socket.room) {
//       return socket.emit('errorMessage', 'No rooms joined!');
//     }
//     socket.to(socket.room).emit('message', {
//       username: socket.username,
//       content: message
//     });
//   })
//
// });
//
// module.exports = app;
//
// server.listen(80, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:80/');
