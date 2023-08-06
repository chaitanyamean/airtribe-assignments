const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const routesConfig = require("./config/routesConfig");
const dbConfig = require("./config/dbConfig");
const chatRoomsModel = require("./models/chatRoomsModel");
const usersModel = require("./models/usersModel");
const dateUtils = require("./utils/dateUtils");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  dbConfig
    .then(() => {
      next();
    })
    .catch((err) => {
      res.send(err);
    });
});

app.use(routesConfig);

const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", async ({ username, room }) => {
    const user = new usersModel({
      chatRoom: room,
      username: username,
      socketId: socket.id,
    });
    socket.join(room);
    await user.save();
    let usersInRoom = await usersModel.find({ chatRoom: room });
    io.to(room).emit("roomUsers", {
      room: user.chatRoom,
      users: usersInRoom,
    });
    io.to(room).emit("broadcastMessage", {
      user: { username: "Airtribe" },
      message: `${user.username} has joined the room`,
      time: dateUtils.getTime(),
    });
  });

  socket.on("SendMessage", async (msg) => {
    let socketId = socket.id;
    let userInfo = await usersModel.findOne({ socketId: socketId });
    if (userInfo) {
      let room = userInfo.chatRoom;
      io.to(room).emit("broadcastMessage", {
        message: msg,
        room: room,
        user: userInfo,
        time: dateUtils.getTime(),
      });
    }
    console.log(socketId, msg);
  });

  socket.on("disconnect", async () => {
    const socketId = socket.id;
    let userInfo = await usersModel.findOne({ socketId: socketId });
    if (userInfo) {
      await usersModel.deleteOne({ socketId: socketId });
      let usersInRoom = await usersModel.find({ chatRoom: userInfo.chatRoom });
      console.log("usersInRoom", usersInRoom);
      io.to(userInfo.chatRoom).emit("roomUsers", {
        room: userInfo.chatRoom,
        users: usersInRoom,
      });
    }
  });
});

module.exports = server;
