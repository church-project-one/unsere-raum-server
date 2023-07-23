const router = require("express").Router();
const { mongoose } = require("mongoose");
const ActivityModel = require("../models/Activity.model");
const RoomModel = require("../models/Room.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { response } = require("express");

router.post("/rooms/:id/activities", isAuthenticated, (req, res, next) => {
  const {id} = req.params
  const { activity, roomId } = req.body;

  RoomModel.findById(id)
    .populate("activities")
    .then(theRoom => {

      console.log(theRoom, "tell me this room")

      const newActivity = {
        roomId: roomId,
        activity: activity,
        owner: req.payload._id
      }

      ActivityModel.create(newActivity)
        .then(activity => {
          return RoomModel.findByIdAndUpdate(roomId, {$push: {activities: activity._id}}, {returnDocument: 'after'});
        })
        .then(response => res.json(response))
        .catch(e => {
          console.error("failed to post the new activity", e);
          res.status(500).json({
            message: "failed to post the new activity",
            error: e
          });
        });
    })
    .catch(e => {
      console.log("failed to find the room's id", e);
      res.status(500).json({
        message: "failed to the find the room's id",
        error: e
      })
    });
});

router.get("/activities", isAuthenticated, (req, res, next) => {
  
  ActivityModel.find()
    .populate({path: "owner", select: "-password"})
    .populate("room")
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to get the activities", e);
      res.status(500).json({
        message: "failed to post the new activity",
        error: e
      });
    });
});

router.get("/activities/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params

  ActivityModel.findById(id)
    .populate({path: "owner", select: "-password"})
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to get the details of activity", e);
      res.status(500).json({
        message: "failed to get the details of activity",
        error: e
      });
    });
});

router.put("/activities/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params;

  const updateActivity = {
    roomId: req.body.roomId,
    activity: req.body.activity,
  };

  ActivityModel.findByIdAndUpdate(id, updateActivity, {new: true})
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to update the activity");
      res.status(500).json({
        message: "failed to update the new activity"
      });
    });
})


router.delete("/activities/:id", isAuthenticated, (req, res, next) => {
  const {id} = req.params;

  ActivityModel.findByIdAndRemove(id)
    .then(response => res.json({message: `Activity with this id ${id} was removed successfully`}))
    .catch(e => {
      console.log("failed to delete", e);
      res.status(500).json({
        message: `failed to delete the id ${id}`
      })
    })
});

module.exports = router;
