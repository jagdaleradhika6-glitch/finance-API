const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "salary",
        "freelance",
        "investment",
        "food",
        "transport",
        "utilities",
        "entertainment",
        "healthcare",
        "education",
        "shopping",
        "other",
      ],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying by common filters
financialRecordSchema.index({ type: 1, category: 1, date: -1 });
financialRecordSchema.index({ createdBy: 1 });

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
