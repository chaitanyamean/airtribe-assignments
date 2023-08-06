const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
    roomName: String
}, {timestamps: {createdAt: true}});

const chatRoomsModel = mongoose.model("chatrooms", chatRoomSchema);
chatRoomsModel.createCollection();

module.exports = chatRoomsModel;