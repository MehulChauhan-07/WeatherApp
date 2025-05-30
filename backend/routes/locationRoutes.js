const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  saveLocation,
  getLocations,
  deleteLocation,
} = require("../controllers/locationController");

router.use(protect); // Protect all routes

router.route("/").post(saveLocation).get(getLocations);

router.delete("/:id", deleteLocation);

module.exports = router;
