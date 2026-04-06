const userService = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

// GET /api/users — Admin only
const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await userService.getAllUsers({ page, limit, search });

    return successResponse(res, 200, "Users fetched successfully", result.users, result.meta);
  } catch (error) {
    logger.error("Get all users failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/users/:id — Admin only
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    logger.error("Get user failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// PATCH /api/users/:id — Admin only (update role or status)
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    logger.info(`User ${req.params.id} updated by admin ${req.user._id}`);
    return successResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    logger.error("Update user failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// DELETE /api/users/:id — Admin only
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id);
    logger.warn(`User ${req.params.id} deleted by admin ${req.user._id}`);
    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    logger.error("Delete user failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
