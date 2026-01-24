// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// create Express + HTTP server
const app = express();
const server = http.createServer(app);

// use environment var for port (deployed hosts often set PORT)
const PORT = process.env.PORT || 8000;

// configure allowed origin(s) for CORS
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : true;

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const path = require('path');
const clientDistPath = path.join(__dirname, 'client', 'dist');

app.use(express.static(clientDistPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});


const users = {}
 
io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id]})
  })  

    socket.on('disconnect', () => {
      const name = users[socket.id]
    if (name) socket.broadcast.emit('user-disconnected', name)
      else socket.broadcast.emit('user-disconnected', 'Unknown User')
    delete users[socket.id]
  })  
})

// start server listening
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
