const { mongoose, model, Schema } = require("mongoose");

const feedSchema = new Schema(
  {
    picture: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    productAddress: {
      street: String,
      number: Number,
      postalcode: Number,
      city: String,
      country: String
    },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      required: true
    },
    ownerFeed: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    ownerResponses: [{
      type: Schema.Types.ObjectId,
      ref: "Response"
    }]
  },

  {
    timestamps: true
  }
);

module.exports = model("Feed", feedSchema);
