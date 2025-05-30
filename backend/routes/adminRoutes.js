const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middleware/authMiddleware");

// All routes require admin authentication
router.use(isAdmin);

// Get admin dashboard statistics
router.get("/stats", adminController.getStats);

// User management routes
router.get("/users", adminController.getUsers);
router.patch("/users/:userId/admin", adminController.toggleAdmin);
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;
