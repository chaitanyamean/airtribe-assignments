const theatresModel = require("../models/Theatres");

const theatresController = require("express").Router();

theatresController.get("/", (req, res) => {
  theatresModel
    .findAll()
    .then((result) => {
      return res.status(200).json({
        date: new Date(),
        data: result,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        dateTime: new Date(),
        error: error,
      });
    });
});

module.exports = theatresController;
