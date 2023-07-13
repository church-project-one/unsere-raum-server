const router = require("express").Router();
const { mongoose } = require("mongoose");
const ActivityModel = require("../models/Activity.model");
const RoomModel = require("../models/Room.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.post("/activities", isAuthenticated, (req, res, next) => {
  const { roomId, date, hour, activity, leader } = req.body;

  const newActivity = {
    roomId: roomId,
    date: date,
    hour: hour,
    activity: activity,
    leader: leader,
    owner: req.payload._id
  }

  ActivityModel.create(newActivity)
    .then(activity => {
      console.log(activity, "tell me this data");
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
});

router.get("/activities", isAuthenticated, (req, res, next) => {

  ActivityModel.find()
    .populate({path: "owner", select: "-password"})
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
    date: req.body.date,
    hour: req.body.hour,
    activity: req.body.activity,
    leader: req.body.leader,
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
