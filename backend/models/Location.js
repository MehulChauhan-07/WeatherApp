const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    city: {
      type: String,
      required: [true, "Please add a city name"],
    },
    country: {
      type: String,
      required: [true, "Please add a country name"],
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      lon: {
        type: Number,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
