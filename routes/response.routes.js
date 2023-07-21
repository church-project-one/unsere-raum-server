const router = require("express").Router();
const mongoose = require("mongoose");
const ResponseModel = require("../models/Response.model");
const FeedModel = require("../models/Feed.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post(
  "/feeds/:feedId/responses",
  isAuthenticated,
  async (req, res, next) => {
    const { feedId } = req.params;

    try {
      const findFeedId = await FeedModel.findById(feedId);

      const newResponse = {
        response: req.body.response,
        ownerResponse: req.payload._id,
      };

      const createNewResponse = await ResponseModel.create(newResponse);
      const pushNewResponseToFeedBody = await FeedModel.findByIdAndUpdate(
        feedId,
        { $push: { ownerResponses: createNewResponse._id } },
        { returnDocument: "after" }
      ).populate({ path: "ownerResponses", populate:{path: "ownerResponse", select: "-password"}});
      res.json(pushNewResponseToFeedBody);
    } catch {
      (e) => {
        console.log("failed to post the new response", e);
        res.status(500).json({
          message: "failed to post the new feed",
          error: e,
        });
      };
    }
  }
);

module.exports = router;
