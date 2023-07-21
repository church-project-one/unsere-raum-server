const router = require("express").Router();
const { mongoose } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

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
});

router.get("/users/:userId", isAuthenticated, async (req, res, next) => {
  const {userId} = req.params;

  console.log(userId)

  try {
    const findTheUserId = await User.findById(userId, {password: 0});
    res.json(findTheUserId);

  } catch { e => {
      console.log("failed to get the user's id");
      res.status(500).json({
        message: "failed to get the user's id",
        error: e
      });
    };
  };
});

module.exports = router;