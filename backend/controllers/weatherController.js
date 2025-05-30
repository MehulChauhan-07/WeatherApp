const axios = require("axios");
const WeatherHistory = require("../models/WeatherHistory");
const SearchHistory = require("../models/SearchHistory");

// @desc    Get weather by city
// @route   GET /api/weather
// @access  Private
const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City parameter is required",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const weatherData = response.data;

    // Save search history
    await SearchHistory.create({
      user: req.user._id,
      city: weatherData.name,
      country: weatherData.sys.country,
    });

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error("Weather fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching weather data",
    });
  }
};

// @desc    Get user's weather history
// @route   GET /api/weather/history
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort({ searchDate: -1 })
      .limit(10);

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching search history",
    });
  }
};

// @desc    Get all users' weather history
// @route   GET /api/weather/history/all
// @access  Private/Admin
const getAllHistory = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await SearchHistory.countDocuments();
    const history = await SearchHistory.find()
      .sort({ searchDate: -1 })
      .populate("user", "username email")
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      history,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error("All history fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all search history",
    });
  }
};

// @desc    Delete a specific weather history entry
// @route   DELETE /api/weather/history/:id
// @access  Private
const deleteHistory = async (req, res) => {
  try {
    const historyEntry = await SearchHistory.findById(req.params.id);

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: "History entry not found",
      });
    }

    // Check if the user owns this history entry or is an admin
    if (
      historyEntry.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this history entry",
      });
    }

    await historyEntry.deleteOne();

    res.json({
      success: true,
      message: "History entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete history error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting history entry",
    });
  }
};

module.exports = {
  getWeatherByCity,
  getUserHistory,
  getAllHistory,
  deleteHistory,
};
