const recordService = require("../services/recordService");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

// POST /api/records — Admin only
const createRecord = async (req, res) => {
  try {
    const record = await recordService.createRecord(req.body, req.user._id);
    logger.success(`Record created by ${req.user.email}`);
    return successResponse(res, 201, "Financial record created successfully", record);
  } catch (error) {
    logger.error("Create record failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/records — All authenticated users
const getAllRecords = async (req, res) => {
  try {
    const result = await recordService.getAllRecords(req.query);
    return successResponse(
      res,
      200,
      "Records fetched successfully",
      result.records,
      result.meta
    );
  } catch (error) {
    logger.error("Get records failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// GET /api/records/:id — All authenticated users
const getRecordById = async (req, res) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    return successResponse(res, 200, "Record fetched successfully", record);
  } catch (error) {
    logger.error("Get record failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// PUT /api/records/:id — Admin only
const updateRecord = async (req, res) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    logger.info(`Record ${req.params.id} updated by ${req.user.email}`);
    return successResponse(res, 200, "Record updated successfully", record);
  } catch (error) {
    logger.error("Update record failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

// DELETE /api/records/:id — Admin only
const deleteRecord = async (req, res) => {
  try {
    await recordService.deleteRecord(req.params.id);
    logger.warn(`Record ${req.params.id} deleted by ${req.user.email}`);
    return successResponse(res, 200, "Record deleted successfully");
  } catch (error) {
    logger.error("Delete record failed:", error.message);
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
