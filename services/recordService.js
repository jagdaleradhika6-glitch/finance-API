const FinancialRecord = require("../models/FinancialRecord");

// Build filter object from query params
const buildFilter = ({ type, category, startDate, endDate, search }) => {
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = category;

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // Search in notes
  if (search) {
    filter.notes = { $regex: search, $options: "i" };
  }

  return filter;
};

// Create a new financial record
const createRecord = async (recordData, userId) => {
  const record = await FinancialRecord.create({
    ...recordData,
    createdBy: userId,
  });

  return record;
};

// Get all records with filtering + pagination
const getAllRecords = async (queryParams) => {
  const { page = 1, limit = 10, sortBy = "date", order = "desc" } = queryParams;
  const skip = (page - 1) * limit;

  const filter = buildFilter(queryParams);
  const sortOrder = order === "asc" ? 1 : -1;

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate("createdBy", "name email") // Show who created it
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    FinancialRecord.countDocuments(filter),
  ]);

  return {
    records,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single record by ID
const getRecordById = async (recordId) => {
  const record = await FinancialRecord.findById(recordId).populate(
    "createdBy",
    "name email"
  );

  if (!record) {
    const error = new Error("Financial record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

// Update a record
const updateRecord = async (recordId, updateData) => {
  const record = await FinancialRecord.findByIdAndUpdate(recordId, updateData, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");

  if (!record) {
    const error = new Error("Financial record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

// Delete a record
const deleteRecord = async (recordId) => {
  const record = await FinancialRecord.findByIdAndDelete(recordId);

  if (!record) {
    const error = new Error("Financial record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
