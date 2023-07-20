const { Schema } = require("mongoose");
const { mongoose, model } = require("mongoose");


const partnerSchema = new Schema(
    {
      partner: {
        type: String,
        require: true
      },
      roomOwner: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    },
    {
      timestamps: true
    }
  );

  module.exports = model("Partner", partnerSchema);