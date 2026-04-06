const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.registerUser({ name, email, password, role });

    logger.success(`New user registered: ${email}`);

    return successResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    logger.error("Register failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    logger.success(`User logged in: ${email}`);

    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    logger.error("Login failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    return successResponse(res, 200, "User profile fetched", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { register, login, getMe };
