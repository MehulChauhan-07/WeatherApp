const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SearchHistory = require("../models/SearchHistory");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: false,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("Login attempt failed: User not found for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login attempt failed: Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Log successful login
    console.log("Login successful for user:", email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// Admin Controllers

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle admin status (admin only)
const toggleAdminStatus = async (req, res) => {
  try {
    console.log("toggleAdminStatus called.");
    console.log("req.user:", req.user);
    const { userId } = req.params;
    const { isAdmin } = req.body;
    console.log("userId from params:", userId);
    console.log("isAdmin from body:", isAdmin);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Found user:", user);

    // Prevent self-demotion
    if (req.user && userId === req.user._id.toString()) {
      console.log("Attempted self-demotion.");
      return res
        .status(400)
        .json({ message: "Cannot modify your own admin status" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    console.log("User admin status toggled successfully.", user);
    res.json({ success: true, user });
  } catch (err) {
    console.error("toggleAdminStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    console.log("deleteUser called.");
    console.log("req.user:", req.user);
    const { userId } = req.params;
    console.log("userId from params:", userId);

    // Prevent self-deletion
    if (req.user && userId === req.user._id.toString()) {
      console.log("Attempted self-deletion.");
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for deletion for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Found user for deletion:", user);

    // Delete user's search history
    await SearchHistory.deleteMany({ userId: userId });
    console.log("Deleted user history for userId:", userId);

    // Delete user
    await user.deleteOne();
    console.log("User deleted successfully.", userId);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's search history (admin only)
const getUserHistory = async (req, res) => {
  // This function might not be directly used by the frontend admin history table
  try {
    console.log("getUserHistory called (admin)..");
    console.log("req.user:", req.user);
    const { userId } = req.params;
    console.log("userId from params:", userId);

    const history = await SearchHistory.find({ userId }).sort({
      searchDate: -1,
    });
    console.log("Found history for user:", userId, history);
    res.json({ success: true, history });
  } catch (err) {
    console.error("getUserHistory error (admin):", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user's search history (admin only)
const deleteUserHistory = async (req, res) => {
  try {
    console.log("deleteUserHistory called.");
    console.log("req.user:", req.user);
    const { userId } = req.params;
    console.log("userId from params:", userId);

    // First check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the history using 'user' field instead of 'userId'
    const deleteResult = await SearchHistory.deleteMany({ user: userId });
    console.log(
      "Search history deletion result for userId:",
      userId,
      deleteResult
    );

    if (deleteResult.deletedCount === 0) {
      console.log("No history found for deletion for userId:", userId);
      return res.status(404).json({
        success: false,
        message: "No history found for this user",
      });
    }

    console.log("User history deleted successfully for userId:", userId);
    res.json({
      success: true,
      message: "User history deleted successfully",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (err) {
    console.error("deleteUserHistory error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Server error while deleting history",
      error: err.message,
    });
  }
};

// Get admin statistics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSearches = await SearchHistory.countDocuments();
    const averageSearchesPerUser =
      totalUsers > 0 ? totalSearches / totalUsers : 0;

    res.json({
      success: true,
      totalUsers,
      totalSearches,
      averageSearchesPerUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all search history (admin only)
const getAllHistory = async (req, res) => {
  try {
    console.log("getAllHistory called.");
    const history = await SearchHistory.find()
      .populate("user", "username")
      .sort({ searchDate: -1 });

    // Filter out history items where user population failed (user is null)
    const validHistory = history.filter((item) => item.user !== null);

    // Transform the data to match the frontend's expected format
    const formattedHistory = validHistory.map((item) => ({
      _id: item._id,
      // Use item.user._id directly as we've filtered out null users
      userId: item.user._id.toString(), // Ensure userId is a string
      username: item.user.username,
      city: item.city,
      country: item.country,
      searchDate: item.searchDate,
    }));

    console.log("Formatted history sent to frontend:", formattedHistory);

    res.json({
      success: true,
      history: formattedHistory,
    });
  } catch (err) {
    console.error("Get all history error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching history",
    });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
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
};
