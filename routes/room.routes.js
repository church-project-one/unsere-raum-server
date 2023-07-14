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

router.get("/rooms", (req, res, next) => {
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
});

router.get("/rooms/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params;

  RoomModel.findById(id)
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to find the room's id", e);
      res.status(500).json({
        message: "failed to find the room's id",
        error: e
      });
    });
});

router.put("/rooms/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params;
  const updateRoom = { 
    title: req.body.title, 
    description: req.body.description
  };

  RoomModel.findByIdAndUpdate(id, updateRoom, {new: true})
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to update the room", e);
      res.status(500).json({
        message: "failed to update the room",
        error: e
      });
    });
});

router.delete("/rooms/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params;

  RoomModel.findByIdAndRemove(id)
    .then(response => res.json(`The room with the id ${id} was successfully removed`))
    .catch(e => {
      console.log("failed to delete the room", e);
      res.status(500).json({
        message: "failed to delete the room",
        error: e
      });
    });
});

module.exports = router;