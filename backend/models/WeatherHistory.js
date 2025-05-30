const mongoose = require("mongoose");

const weatherHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    weather: {
      condition: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      temperature: {
        current: {
          type: Number,
          required: true,
        },
        feels_like: {
          type: Number,
          required: true,
        },
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
      },
      humidity: {
        type: Number,
        required: true,
      },
      wind: {
        speed: {
          type: Number,
          required: true,
        },
        direction: {
          type: Number,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WeatherHistory", weatherHistorySchema);
