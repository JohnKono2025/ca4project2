const express = require("express");
const socket = require("socket.io");

// App setups
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
 console.log(`Listening on port ${PORT}`);
 console.log("Socket.io Chat Server is running...");

});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  //show in console that a user has connected
  console.log('Made socket connection');
  
  
  


  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    //... is the the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
    
  });

  socket.broadcast.emit('newUserConnected', { userId: socket.userId });
//this is the event that is emitted when a user disconnects
  socket.on("disconnect", function () {
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
      console.log('user disconnected');
     
    });

    socket.on("chat message", function (data) {
      io.emit("chat message", data);
  });
  

});