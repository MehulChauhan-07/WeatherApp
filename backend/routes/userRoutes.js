const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/adminAuth");
const {
  register,
  login,
  getProfile,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  toggleAdminStatus,
  deleteUser,
  getUserHistory,
  deleteUserHistory,
  getAdminStats,
  getAllHistory,
  getUserById,
} = require("../controllers/userController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.use(protect);
router.get("/profile", getProfile);
router.get("/me", getCurrentUser);
router.put("/me", updateProfile);

// Admin routes (require authentication and admin privileges)
router.use("/admin", isAdmin);
router.get("/admin/stats", getAdminStats);
router.get("/admin/users", getAllUsers);
router.get("/admin/users/:userId", getUserById);
router.patch("/admin/users/:userId/admin", toggleAdminStatus);
router.delete("/admin/users/:userId", deleteUser);
router.get("/admin/history", getAllHistory);
router.delete("/admin/users/:userId/history", deleteUserHistory);

module.exports = router;
