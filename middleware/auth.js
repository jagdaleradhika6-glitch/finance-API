const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

// Middleware 1: Verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, 401, "Access denied. Please log in first.");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (excluding password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, "User no longer exists.");
    }

    if (user.status === "inactive") {
      return errorResponse(res, 403, "Your account has been deactivated.");
    }

    // Attach user to request so controllers can use it
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, 401, "Invalid token. Please log in again.");
    }
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired. Please log in again.");
    }
    return errorResponse(res, 500, "Authentication error.");
  }
};

// Middleware 2: Role-based access control
// Usage: authorize("admin") or authorize("admin", "analyst")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
