const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Get page by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const page = await Page.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ page });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all pages (admin)
router.get("/", auth, async (req, res) => {
  try {
    const pages = await Page.find().sort({ slug: 1 });
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update page (admin)
router.put("/:slug", auth, async (req, res) => {
  try {
    const { title, sections, content, metaDescription, isActive } = req.body;

    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Update fields
    if (title) page.title = title;
    if (metaDescription !== undefined) page.metaDescription = metaDescription;
    if (isActive !== undefined) page.isActive = isActive;

    // Support both old sections format and new content format
    if (sections) page.sections = sections;
    if (content) page.content = content;

    await page.save();

    res.json({
      message: "Page updated successfully",
      page,
    });
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
