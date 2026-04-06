/**
 * SEED SCRIPT
 * Run with: node seed.js
 * Creates 3 test users and 20 sample financial records
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const FinancialRecord = require("./models/FinancialRecord");

const users = [
  {
    name: "Admin User",
    email: "admin@finance.com",
    password: "password123",
    role: "admin",
    status: "active",
  },
  {
    name: "Alice Analyst",
    email: "analyst@finance.com",
    password: "password123",
    role: "analyst",
    status: "active",
  },
  {
    name: "Victor Viewer",
    email: "viewer@finance.com",
    password: "password123",
    role: "viewer",
    status: "active",
  },
];

const generateRecords = (adminId) => [
  { amount: 85000, type: "income",  category: "salary",        date: "2024-01-01", notes: "January salary", createdBy: adminId },
  { amount: 45000, type: "income",  category: "freelance",     date: "2024-01-10", notes: "Web project payment", createdBy: adminId },
  { amount: 12000, type: "expense", category: "food",          date: "2024-01-05", notes: "Monthly groceries", createdBy: adminId },
  { amount: 8500,  type: "expense", category: "transport",     date: "2024-01-08", notes: "Fuel and cab", createdBy: adminId },
  { amount: 3500,  type: "expense", category: "utilities",     date: "2024-01-12", notes: "Electricity + internet", createdBy: adminId },
  { amount: 85000, type: "income",  category: "salary",        date: "2024-02-01", notes: "February salary", createdBy: adminId },
  { amount: 15000, type: "expense", category: "entertainment", date: "2024-02-14", notes: "Valentine's dinner + gifts", createdBy: adminId },
  { amount: 25000, type: "income",  category: "investment",    date: "2024-02-20", notes: "Mutual fund returns", createdBy: adminId },
  { amount: 9000,  type: "expense", category: "healthcare",    date: "2024-02-22", notes: "Doctor visit + medicines", createdBy: adminId },
  { amount: 85000, type: "income",  category: "salary",        date: "2024-03-01", notes: "March salary", createdBy: adminId },
  { amount: 30000, type: "expense", category: "education",     date: "2024-03-05", notes: "Online course subscription", createdBy: adminId },
  { amount: 18000, type: "expense", category: "shopping",      date: "2024-03-15", notes: "Clothes and accessories", createdBy: adminId },
  { amount: 60000, type: "income",  category: "freelance",     date: "2024-03-20", notes: "Mobile app project", createdBy: adminId },
  { amount: 5000,  type: "expense", category: "food",          date: "2024-03-25", notes: "Restaurant outings", createdBy: adminId },
  { amount: 85000, type: "income",  category: "salary",        date: "2024-04-01", notes: "April salary", createdBy: adminId },
  { amount: 50000, type: "income",  category: "investment",    date: "2024-04-10", notes: "Stock dividends", createdBy: adminId },
  { amount: 22000, type: "expense", category: "shopping",      date: "2024-04-18", notes: "Electronics purchase", createdBy: adminId },
  { amount: 7000,  type: "expense", category: "transport",     date: "2024-04-20", notes: "Train tickets for trip", createdBy: adminId },
  { amount: 4000,  type: "expense", category: "utilities",     date: "2024-04-25", notes: "Phone bill + OTT subscriptions", createdBy: adminId },
  { amount: 10000, type: "expense", category: "other",         date: "2024-04-28", notes: "Miscellaneous expenses", createdBy: adminId },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users (passwords auto-hashed by model hook)
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === "admin");
    console.log("👥 Created 3 users:");
    createdUsers.forEach((u) => console.log(`   - ${u.role}: ${u.email} / password123`));

    // Create financial records
    const records = generateRecords(adminUser._id);
    await FinancialRecord.create(records);
    console.log(`📊 Created ${records.length} financial records`);

    console.log("\n🎉 Seed complete! You can now test the API.");
    console.log("─────────────────────────────────────────");
    console.log("Login credentials:");
    console.log("  Admin:   admin@finance.com / password123");
    console.log("  Analyst: analyst@finance.com / password123");
    console.log("  Viewer:  viewer@finance.com / password123");
    console.log("─────────────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
