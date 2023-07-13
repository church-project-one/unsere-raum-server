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
    }]
  },
  {
    timestamps: true
  }
)

module.exports = model("Room", roomSchema);