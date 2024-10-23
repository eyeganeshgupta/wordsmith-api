const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true, // Adding an index for faster queries involving the user field
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false, // Post may be optional
    },
    amount: {
      type: Number,
      required: [true, "Earning amount is required"],
      min: [0, "Earning amount must be a positive number"],
    },
    calculatedOn: {
      type: Date,
      default: () => Date.now(), // Using a function to get the current date
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disables the __v field (version key)
  }
);

// Adding indexes
earningSchema.index({ user: 1, post: 1 });

module.exports = mongoose.model("Earning", earningSchema);
