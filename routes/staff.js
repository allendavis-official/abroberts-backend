const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for staff photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/staff";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "staff-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// Get all staff (admin)
router.get("/", auth, async (req, res) => {
  try {
    const staff = await Staff.find().sort({ order: 1, createdAt: -1 });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get active staff (public)
router.get("/active", async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ order: 1 });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get staff by ID (admin)
router.get("/:id", auth, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create staff (admin)
router.post("/", auth, async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res
      .status(201)
      .json({ message: "Staff member created successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update staff (admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ message: "Staff member updated successfully", staff });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete staff (admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Delete photo file if exists
    if (staff.photoUrl) {
      const photoPath = path.join(__dirname, "..", staff.photoUrl);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Upload staff photo (admin)
router.post("/:id/photo", auth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Delete old photo if exists
    if (staff.photoUrl) {
      const oldPhotoPath = path.join(__dirname, "..", staff.photoUrl);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update with new photo
    staff.photoUrl = "/uploads/staff/" + req.file.filename;
    await staff.save();

    res.json({
      message: "Photo uploaded successfully",
      photoUrl: staff.photoUrl,
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
