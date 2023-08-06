const routesConfig = require("express").Router();

const chatRoomsController = require("../controllers/chatRoomsController");

routesConfig.use("/api/chat-rooms", chatRoomsController);

module.exports = routesConfig;