const { Schema, model, mongoose } = require("mongoose");

const acitivitySchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room"
    },
    activity: {
      type: String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }, 
  {
    timestamps: true
  }
)

module.exports = model("Activity", acitivitySchema);