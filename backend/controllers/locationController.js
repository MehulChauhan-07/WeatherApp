const Location = require("../models/Location");

// @desc    Save a new location
// @route   POST /api/locations
// @access  Private
const saveLocation = async (req, res) => {
  try {
    const { city, country, coordinates } = req.body;

    const location = await Location.create({
      user: req.user.id,
      city,
      country,
      coordinates,
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's saved locations
// @route   GET /api/locations
// @access  Private
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id });
    res.json(locations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Check user
    if (location.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await location.deleteOne();
    res.json({ message: "Location removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  saveLocation,
  getLocations,
  deleteLocation,
};
