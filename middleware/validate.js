const { body, query, param, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");

// Helper: Run this after validation rules to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return errorResponse(res, 400, "Validation failed", formattedErrors);
  }
  next();
};

// --- Auth Validation Rules ---
const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["viewer", "analyst", "admin"]).withMessage("Role must be: viewer, analyst, or admin"),

  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// --- Financial Record Validation Rules ---
const validateFinancialRecord = [
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn([
      "salary", "freelance", "investment",
      "food", "transport", "utilities",
      "entertainment", "healthcare", "education",
      "shopping", "other",
    ]).withMessage("Invalid category"),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("notes")
    .optional()
    .isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),

  handleValidationErrors,
];

// --- Query Validation for Filters ---
const validateRecordFilters = [
  query("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type filter must be income or expense"),

  query("category")
    .optional()
    .isIn([
      "salary", "freelance", "investment",
      "food", "transport", "utilities",
      "entertainment", "healthcare", "education",
      "shopping", "other",
    ]).withMessage("Invalid category filter"),

  query("startDate")
    .optional()
    .isISO8601().withMessage("startDate must be a valid date"),

  query("endDate")
    .optional()
    .isISO8601().withMessage("endDate must be a valid date"),

  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];

// --- User Status Update Validation ---
const validateUserUpdate = [
  body("status")
    .optional()
    .isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),

  body("role")
    .optional()
    .isIn(["viewer", "analyst", "admin"]).withMessage("Role must be: viewer, analyst, or admin"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateFinancialRecord,
  validateRecordFilters,
  validateUserUpdate,
};
