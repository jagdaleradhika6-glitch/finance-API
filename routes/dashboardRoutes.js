const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrend,
  getRecentTransactions,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

// Dashboard is only for analyst and admin — viewers are blocked
router.use(protect);
router.use(authorize("admin", "analyst"));

router.get("/summary", getSummary);
router.get("/categories", getCategoryTotals);
router.get("/monthly", getMonthlyTrend);
router.get("/recent", getRecentTransactions);

module.exports = router;
