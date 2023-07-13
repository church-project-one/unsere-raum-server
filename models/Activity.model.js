const { Schema, model, mongoose } = require("mongoose");

const acitivitySchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room"
    },
    date: {
      type: Date,
      required: true
    },
    hour: {
      type: String,
      required: true
    },
    activity: {
      type: String,
      required: true
    },
    leader: {
      type: String,
      require: true
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