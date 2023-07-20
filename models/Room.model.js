const { mongoose, model, Schema } = require("mongoose");

const roomSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    activities: [{
      type: Schema.Types.ObjectId,
      ref: "Activity"
    }],
    roomOwner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    partners:[{
      type: Schema.Types.ObjectId,
      ref: "Partner"
    }]
  },
  {
    timestamps: true
  }
)

module.exports = model("Room", roomSchema);