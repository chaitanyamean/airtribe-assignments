const mongoose = require("mongoose");


let userSchema = new mongoose.Schema({
    chatRoom: {
        type: String,
        index: true
    },
    username: String,
    socketId: String
}, {timestamps: {createdAt: true}});

let usersModel = mongoose.model("users", userSchema);
usersModel.createCollection();

module.exports = usersModel;