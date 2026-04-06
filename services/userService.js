const User = require("../models/User");

// Get all users (Admin only)
const getAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;

  // Build search filter
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// Update user role or status (Admin only)
const updateUser = async (userId, updateData) => {
  const allowedFields = ["role", "status"];
  const filteredData = {};

  // Only allow updating role and status
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true, // Return updated document
    runValidators: true,
  }).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Delete user (Admin only)
const deleteUser = async (userId, requestingUserId) => {
  if (userId === requestingUserId.toString()) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
