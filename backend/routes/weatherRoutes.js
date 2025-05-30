const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getWeatherByCity,
  getUserHistory,
  getAllUsersHistory,
} = require("../controllers/weatherController");

// @route   GET /api/weather
// @desc    Get weather by city
// @access  Private
router.get("/", protect, getWeatherByCity);

// @route   GET /api/weather/history
// @desc    Get user's weather history
// @access  Private
router.get("/history", protect, getUserHistory);

// @route   GET /api/weather/history/all
// @desc    Get all users' weather history
// @access  Private/Admin
router.get("/history/all", protect, admin, getAllUsersHistory);

module.exports = router;
