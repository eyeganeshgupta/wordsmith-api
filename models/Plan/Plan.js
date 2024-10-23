const mongoose = require("mongoose");

// Schema
const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
      minlength: [1, "Plan name must be at least 1 characters long"],
      maxlength: [48, "Plan name cannot exceed 48 characters"],
      index: true,
    },
    features: {
      type: [String],
      default: [],
    },
    limitations: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", planSchema);
