const router = require("express").Router();
const mongoose = require("mongoose");
const FeedModel = require("../models/Feed.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("picture"), (req, res, next) => {
  res.json({picture: req.file.path})
})

router.post("/feeds", async (req, res, next) => {
  try {
    const newFeedBody = {
      picture: req.body.picture,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      productAddress: {
        street: req.body.productAddress.street,
        number: req.body.productAddress.number,
        postalcode: req.body.productAddress.postalcode,
        city: req.body.productAddress.city,
        country: req.body.productAddress.country
      },
      availability: req.body.availability,
      ownerFeed: req.payload._id
    };

    const createNewFeed = await FeedModel.create(newFeedBody);
    res.json(createNewFeed);

  } catch{ e => {
      console.log("error to post the feeds", e);
      res.status(500).json({
        message: "failed to post the feed",
        error: e
      });
    };
  };
});
  

router.get("/feeds", async(req, res, next) => {
  try {
    const findFeeds = await FeedModel.find().populate({path: "ownerFeed", select: "-password"}).populate({path: "ownerResponses", populate:{path: "ownerResponse", select: "-password"}});
    res.json(findFeeds);
    
  } catch{ e =>
    console.log("failed to post the feeds", e);
    res.status(500).json({
      message: "error to post the feeds",
      error: e
    });
  }
});

router.get("/feeds/:feedId", async(req, res, next) => {
  const {feedId} = req.params;

  try{
    const findFeedId = await FeedModel.findById(feedId)
    .populate({path: "ownerFeed", select: "-password"}).populate({path: "ownerResponses", populate:{path: "ownerResponse", select: "-password"}});
    res.json(findFeedId);

  } catch{ e => {
    console.log("error to post the feeds", e);
    res.status(500).json({
      message: "failed to post the feed",
      error: e
    })
  }
}
});

router.put("/feeds/:feedId", isAuthenticated, async (req, res, next) => {
  const {feedId} = req.params;
  
  const getFeedBody = {
    picture: req.body.picture,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    productAddress: {
      street: req.body.productAddress.street,
      number: req.body.productAddress.number,
      postalcode: req.body.productAddress.postalcode,
      city: req.body.productAddress.city,
      country: req.body.productAddress.country
    },
    availability: req.body.availability
  }
  
  try {
    const updateFeed = await FeedModel.findByIdAndUpdate(feedId, getFeedBody, {new: true})
    res.json(updateFeed);

  } catch{ e => {
    console.log("error to post the feeds", e);
    res.status(500).json({
      message: "failed to post the feed",
      error: e
    })
  }
}
});

router.delete("/feeds/:feedId", isAuthenticated, async(req, res, next) => {
  const {feedId} = req.params;

  try{
    const deleteFeedId = await FeedModel.findByIdAndRemove(feedId);
    res.json({message: `Success to delete ${deleteFeedId}`});
    
  } catch{ e => {
    console.log("error to post the feeds", e);
    res.status(500).json({
      message: "failed to post the feed",
      error: e
    })
  }
}
});

module.exports = router;
