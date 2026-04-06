// Simple logger that adds timestamps to all logs
const logger = {
  info: (message, data = "") => {
    console.log(`[${new Date().toISOString()}] ℹ️  INFO: ${message}`, data);
  },
  error: (message, error = "") => {
    console.error(`[${new Date().toISOString()}] ❌ ERROR: ${message}`, error);
  },
  warn: (message, data = "") => {
    console.warn(`[${new Date().toISOString()}] ⚠️  WARN: ${message}`, data);
  },
  success: (message, data = "") => {
    console.log(`[${new Date().toISOString()}] ✅ SUCCESS: ${message}`, data);
  },
};

module.exports = logger;
