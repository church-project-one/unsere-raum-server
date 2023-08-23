const { Schema } = require("mongoose");
const { mongoose, model } = require("mongoose");


const partnerSchema = new Schema(
    {
      partner: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      roomFrom: {
        type: Schema.Types.ObjectId,
        ref: "Room"
      }
    },
    {
      timestamps: true
    }
  );

  module.exports = model("Partner", partnerSchema);