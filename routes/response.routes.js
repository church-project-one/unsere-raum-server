const router = require("express").Router();
const mongoose = require("mongoose");
const ResponseModel = require("../models/Response.model");
const FeedModel = require("../models/Feed.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

router.post("upload", fileUploader.single("picture"), (req, res, next) => {
  res.json({picture: req.file.path})
});

router.post(
  "/feeds/:feedId/responses",
  isAuthenticated,
  async (req, res, next) => {
    const { feedId } = req.params;

    try {
      const findFeedId = await FeedModel.findById(feedId);

      const newResponse = {
        response: req.body.response,
        rating: req.body.rating,
        picture: req.body.picture,
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

router.get("/responses", isAuthenticated, async(req, res, next) => {
  try {
    const findListResponses = await ResponseModel.find().populate({path: "ownerResponse", select: "-password"});
    res.json(findListResponses);

  } catch { e => {
      console.log("failed to get the list of responses", e);
      res.status(500).json({
        message: "error to fetch the list of responses",
        error: e
      })
    }

  }
});

router.get("/responses/:responseId", isAuthenticated, async(req, res, next) => {
  const {responseId} = req.params;

  try{
    const findResponseId = await ResponseModel.findById(responseId);
    res.json(findResponseId);
  } catch { e => {
    console.log("failed to find the response id", e);
    res.status(500).json({
      message: "error to fetch the response id",
      error: e,
    });
  }

  }

});

router.put("/responses/:responseId", isAuthenticated, async(req, res, next) => {
  const {responseId} = req.params;

  try {

    const updateResponseBody = {
      response: req.body.response,
      rating: req.body.rating,
      picture: req.body.picture
    };

    const updateResponse = await ResponseModel.findByIdAndUpdate(responseId, updateResponseBody, {new: true});
    res.json(updateResponse);

  } catch { e => {
      console.log("failed updating response", e);
      res.status(500).json({
        message: "error updating response",
        error: e
      });
    };
  };
});

router.delete("/responses/:responseId", isAuthenticated, async(req, res, next) => {
  const {responseId} = req.params;

  try {
    const deleteResponse = await ResponseModel.findByIdAndRemove(responseId)
    res.json({message: `you have succeeded to removed id ${deleteResponse._id} from DB`})

  } catch {

  };
});

module.exports = router;
