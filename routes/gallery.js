const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createThumbnail, optimizeImage } = require('../utils/imageProcessor');

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const images = await Gallery.find(query).sort({ order: 1, uploadedAt: -1 });

    // Get all unique categories
    const categories = await Gallery.distinct('category');

    res.json({
      success: true,
      images,
      categories
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gallery images'
    });
  }
});

// Upload image (admin)
router.post('/',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const { category, caption, order } = req.body;

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }

      const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);

      // Optimize image
      await optimizeImage(imagePath);

      // Create thumbnail
      const thumbnailUrl = await createThumbnail(imagePath);

      const image = new Gallery({
        imageUrl: `/uploads/${req.file.filename}`,
        thumbnailUrl,
        category,
        caption: caption || '',
        order: order || 0,
        uploadedBy: req.user._id
      });

      await image.save();

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        image
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
    }
  }
);

// Update image details (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, caption, order } = req.body;

    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    if (category) image.category = category;
    if (caption !== undefined) image.caption = caption;
    if (order !== undefined) image.order = order;

    await image.save();

    res.json({
      success: true,
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image'
    });
  }
});

// Reorder image (admin)
router.patch('/:id/reorder', auth, async (req, res) => {
  try {
    const { order } = req.body;

    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    image.order = order;
    await image.save();

    res.json({
      success: true,
      message: 'Image reordered successfully',
      image
    });
  } catch (error) {
    console.error('Reorder image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder image'
    });
  }
});

// Delete image (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete physical files
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    const thumbnailPath = path.join(__dirname, '..', image.thumbnailUrl);

    try {
      await fs.unlink(imagePath);
      if (image.thumbnailUrl) {
        await fs.unlink(thumbnailPath);
      }
    } catch (err) {
      console.error('File deletion error:', err);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
});

module.exports = router;
