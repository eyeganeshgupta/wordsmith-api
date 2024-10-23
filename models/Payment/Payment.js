const mongoose = require("mongoose");

// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensuring payment must be associated with a user
      index: true,
    },
    reference: {
      type: String,
      required: [true, "Payment reference is required"],
      trim: true,
      unique: true, // Ensuring uniqueness for payment reference
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Subscription plan is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
