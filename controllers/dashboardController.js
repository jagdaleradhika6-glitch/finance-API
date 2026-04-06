const dashboardService = require("../services/dashboardService");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

// GET /api/dashboard/summary — Analyst + Admin
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await dashboardService.getDashboardSummary({ startDate, endDate });

    return successResponse(res, 200, "Dashboard summary fetched", summary);
  } catch (error) {
    logger.error("Get summary failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/dashboard/categories — Analyst + Admin
const getCategoryTotals = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const data = await dashboardService.getCategoryTotals({ startDate, endDate, type });

    return successResponse(res, 200, "Category totals fetched", data);
  } catch (error) {
    logger.error("Get category totals failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/dashboard/monthly — Analyst + Admin
const getMonthlyTrend = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await dashboardService.getMonthlyTrend(year);

    return successResponse(res, 200, "Monthly trend fetched", data);
  } catch (error) {
    logger.error("Get monthly trend failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/dashboard/recent — Analyst + Admin
const getRecentTransactions = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await dashboardService.getRecentTransactions(limit);

    return successResponse(res, 200, "Recent transactions fetched", data);
  } catch (error) {
    logger.error("Get recent transactions failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrend,
  getRecentTransactions,
};
