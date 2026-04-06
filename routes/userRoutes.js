const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { validateUserUpdate } = require("../middleware/validate");

// All user management routes require login + admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", validateUserUpdate, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
