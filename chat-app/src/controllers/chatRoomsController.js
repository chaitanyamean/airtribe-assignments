const chatRoomsModel = require("../models/chatRoomsModel");

const chatRoomsController = require("express").Router();

chatRoomsController.get("/", (req, res) => {
    chatRoomsModel.find().then((result) => {
        res.status(200).json({
            dateTime: new Date(),
            data: result
        });
    }).catch((err) => {
        res.status(200).json({
            dateTime: new Date(),
            description: err.message,
            error: err
        });
    });
});

module.exports = chatRoomsController;