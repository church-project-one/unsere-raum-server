const router = require("express").Router();
const { mongoose } = require("mongoose");
const PartnerModel = require("../models/Partner.model");
const RoomModel = require("../models/Room.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/rooms/:roomId/partners", isAuthenticated, async (req, res, next) => {
  const {roomId} = req.params;

  try{
    const findRoomId = await RoomModel.findById(roomId);
    const addNewPartner = {
      partner: req.body.partner,
      roomFrom: req.body.roomFrom
    };
    
    const addPartner = await PartnerModel.create(addNewPartner);
    const room = await RoomModel.findByIdAndUpdate(roomId, {$push: {partners: addPartner._id}}, {returnDocument: "after"}).populate("partners")
    res.json(room)

  } catch{e => {
    console.log("failed to add a new id to the room", e);
    res.status(500).json({message: "error to add a new id", error: e})
  }}
    
});

router.get("/partners", isAuthenticated, async(req, res, next) => {
  try{
    const fetchPartners = await PartnerModel.find().populate({path: "partner", select: "-password"}).populate("roomFrom")
    res.json(fetchPartners);
  } catch{e => {
    console.log("failed to add a new id to the room", e);
    res.status(500).json({message: "error to add a new id", error: e})
  }

  }
})

router.put("/partners/:partnerId", isAuthenticated, async(req, res, next) => {
  const {partnerId} = req.params;

  try{
    const getThePartnerBody = {partnerId: req.body.partner};

    const updatePartnerId = await PartnerModel.findByIdAndUpdate(partnerId, getThePartnerBody, {new: true})
    res.json(updatePartnerId);

  } catch {
    e => console.log("error to edit the partner Id",e)
    res.status(500).json({
      message: "error to edit the parter id",
      error: e
    })
  }
});

router.delete("/partners/:partnerId", async(req, res, next) => {
  const {partnerId} = req.params

  try{
    const removedPartnerId = await PartnerModel.findByIdAndRemove(partnerId)
    res.json(`you have removed id ${removedPartnerId._id}`)
  } catch{
    e => console.log("error to edit the partner Id",e)
    res.status(500).json({
      message: "error to edit the parter id",
      error: e
    })
  }
})


module.exports = router;
