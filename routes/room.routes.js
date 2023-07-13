const router = require("express").Router();
const { mongoose } = require("mongoose");
const RoomModel = require("../models/Room.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/rooms", isAuthenticated, (req, res, next) => {
    const {title, description} = req.body;
    const newRoom = {title: title, description: description};

    RoomModel.create(newRoom)
      .then(response => res.json(response))
      .catch(e => {
        console.log("failed to make a new room", e);
        res.status(500).json({
          message: "failed to make a new room",
          error: e
        });
      });
});

router.get("/rooms", isAuthenticated, (req, res, next) => {
  RoomModel.find()
    .populate({path: "activities", select: "-password"})
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to fetch the rooms", e);
      res.status(500).json({
        message: "failed to fetch the rooms",
        error: e
      });
    });
})

module.exports = router;