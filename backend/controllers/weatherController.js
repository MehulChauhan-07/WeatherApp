const axios = require("axios");
const WeatherHistory = require("../models/WeatherHistory");

// @desc    Get weather by city
// @route   GET /api/weather
// @access  Private
const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user found",
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const weatherData = {
      location: {
        city: response.data.name,
        country: response.data.sys.country,
      },
      weather: {
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        temperature: {
          current: response.data.main.temp,
          feels_like: response.data.main.feels_like,
          min: response.data.main.temp_min,
          max: response.data.main.temp_max,
        },
        humidity: response.data.main.humidity,
        wind: {
          speed: response.data.wind.speed,
          direction: response.data.wind.deg,
        },
      },
    };

    // Save to history
    await WeatherHistory.create({
      user: req.user._id,
      location: weatherData.location,
      weather: weatherData.weather,
    });

    res.json(weatherData);
  } catch (error) {
    console.error("Weather fetch error:", error);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

// @desc    Get user's weather history
// @route   GET /api/weather/history
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user found",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await WeatherHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WeatherHistory.countDocuments({ user: req.user._id });

    res.json({
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: "Error fetching weather history" });
  }
};

// @desc    Get all users' weather history (admin only)
// @route   GET /api/weather/history/all
// @access  Private/Admin
const getAllUsersHistory = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized as admin",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const history = await WeatherHistory.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WeatherHistory.countDocuments();

    res.json({
      history,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("All history fetch error:", error);
    res.status(500).json({ message: "Error fetching all weather history" });
  }
};

module.exports = {
  getWeatherByCity,
  getUserHistory,
  getAllUsersHistory,
};
