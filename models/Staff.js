const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    role: {
      type: String,
      enum: ["CEO", "Leadership", "Administrator", "Staff", "Other"],
      default: "Staff",
    },
    bio: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
