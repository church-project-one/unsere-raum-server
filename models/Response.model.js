const { mongoose, Schema, model } = require("mongoose");

const responseSchema = new Schema(
  {
    response: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      // required: true
    },
    picture: String,
    ownerResponse: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Response", responseSchema);