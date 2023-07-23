const { mongoose, model, Schema } = require("mongoose");

const feedSchema = new Schema(
  {
    picture: {
      type: String
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
    },
    productAddress: {
      street: String,
      number: Number,
      postalcode: Number,
      city: String,
      country: String
    },
    availability: {
      type: String
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
