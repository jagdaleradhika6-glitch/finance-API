const express = require("express");
const router = express.Router();
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { protect, authorize } = require("../middleware/auth");
const {
  validateFinancialRecord,
  validateRecordFilters,
} = require("../middleware/validate");

// All record routes require login
router.use(protect);

// Read — available to all authenticated users (viewer, analyst, admin)
router.get("/", validateRecordFilters, getAllRecords);
router.get("/:id", getRecordById);

// Write — admin only
router.post("/", authorize("admin"), validateFinancialRecord, createRecord);
router.put("/:id", authorize("admin"), validateFinancialRecord, updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
