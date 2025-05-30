const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
// Import the controller functions
const {
  getWeatherByCity,
  getUserHistory,
  getAllHistory,
  deleteHistory,
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
router.get("/history/all", protect, getAllHistory);

// @route   DELETE /api/weather/history/:id
// @desc    Delete a specific weather history entry
// @access  Private
router.delete("/history/:id", protect, deleteHistory);

module.exports = router;
