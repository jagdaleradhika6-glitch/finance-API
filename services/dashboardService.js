const FinancialRecord = require("../models/FinancialRecord");

// Get complete dashboard summary
const getDashboardSummary = async (filters = {}) => {
  const { startDate, endDate } = filters;

  // Build date filter
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.$gte = new Date(startDate);
    if (endDate) dateFilter.date.$lte = new Date(endDate);
  }

  // Use MongoDB aggregation for efficiency (one DB call instead of many)
  const [summary] = await FinancialRecord.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
        totalRecords: { $sum: 1 },
      },
    },
  ]);

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalRecords: summary?.totalRecords || 0,
  };
};

// Get totals grouped by category
const getCategoryTotals = async (filters = {}) => {
  const { startDate, endDate, type } = filters;

  const matchFilter = {};
  if (type) matchFilter.type = type;
  if (startDate || endDate) {
    matchFilter.date = {};
    if (startDate) matchFilter.date.$gte = new Date(startDate);
    if (endDate) matchFilter.date.$lte = new Date(endDate);
  }

  const categoryTotals = await FinancialRecord.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 }, // Sort by highest total first
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
  ]);

  return categoryTotals;
};

// Get monthly income vs expense trend
const getMonthlyTrend = async (year) => {
  const currentYear = year || new Date().getFullYear();

  const monthlyData = await FinancialRecord.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
      },
    },
  ]);

  return monthlyData;
};

// Get recent transactions
const getRecentTransactions = async (limit = 10) => {
  const records = await FinancialRecord.find()
    .populate("createdBy", "name")
    .sort({ date: -1 })
    .limit(Number(limit));

  return records;
};

module.exports = {
  getDashboardSummary,
  getCategoryTotals,
  getMonthlyTrend,
  getRecentTransactions,
};
