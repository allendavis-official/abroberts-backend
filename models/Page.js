const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
    },
    // Keep old sections for other pages (about, contact)
    sections: [
      {
        sectionId: String,
        heading: String,
        content: String,
        imageUrl: String,
        order: Number,
      },
    ],
    // New content structure for homepage
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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

module.exports = mongoose.model("Page", pageSchema);
