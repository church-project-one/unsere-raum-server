const router = require("express").Router();
const { mongoose } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const RoomModel = require("../models/Room.model");

router.get("/users", isAuthenticated, (req, res, next) => {

  User.find({}, {password: 0})
    .then(response => res.json(response))
    .catch(e => {
      console.log("failed to catch the users", e);
      res.status(500).json({
        message: "error to fetch the users",
        error: e
      })
    })
})

module.exports = router;