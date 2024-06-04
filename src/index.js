// import dotenv from "dotenv";
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
// import { Server } from "socket.io";
// const { Server } = require("socket.io");
// const { addUser, removeUser } = require('./functions/socketFunctions')
// const removeUser = require('./functions/socketFunctions/removeUser')
const connectDB = require("./config/db");
const realtime = require("./ablyInstance");
dotenv.config({ path: "./src/config/config.env" }); //load env vars

//global vars
// global.io;
// global.onlineUsers = [];

//server setup
const PORT = process.env.PORT || 8001;

// DatabaseConnection.initialize().then(() => {
setInterval(()=>{
  realtime.connection.connect()
  console.log("🚀 ~ file: index.js:23 ~ setTimeout ~ realtime:")
},60000)
var server = http.createServer(app);
server.listen(PORT, () => {
  connectDB();
  realtime.connection.on('connected', () => {
    console.log('Connected to Ably!');
  });
  
  realtime.connection.on('disconnected', () => {
    console.log('Disconnected from Ably. Reconnecting...');
    realtime.connection.connect();
    // You can implement your logic here, such as attempting to reconnect.
    // For example, you can use a backoff strategy to retry the connection.
  });
  
  realtime.connection.on('failed', () => {
    console.error('Connection to Ably failed. Retrying...');
    realtime.connection.connect();
    // You might want to implement a strategy to handle failed connections.
    // For example, you can use a backoff strategy to retry the connection.
  });
  console.log(`Server is running on port ${PORT}`);
});

// let io: Server;

// const onlineUsers: string[] = [];
// global.io;
// io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket", socket.id);
//   io.to(socket.id).emit("reconnect", socket.id);
//   console.log('online users',global.onlineUsers)

//   socket.on("join", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("logout", () => {
//     removeUser(socket.id);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log("user disconnected", socket.id);
//   });
// });
// });