const express = require('express');
const { body } = require('express-validator');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services'
    });
  }
});

// Get all services including inactive (admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });

    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services'
    });
  }
});

// Get single service (admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service'
    });
  }
});

// Create service (admin)
router.post('/',
  auth,
  [
    body('packageName').notEmpty().withMessage('Package name is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { packageName, description, items, order, isActive } = req.body;

      const service = new Service({
        packageName,
        description,
        items,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      });

      await service.save();

      res.status(201).json({
        success: true,
        message: 'Service package created successfully',
        service
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create service'
      });
    }
  }
);

// Update service (admin)
router.put('/:id',
  auth,
  [
    body('packageName').notEmpty().withMessage('Package name is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { packageName, description, items, order, isActive } = req.body;

      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      service.packageName = packageName;
      service.description = description;
      service.items = items;
      service.order = order !== undefined ? order : service.order;
      service.isActive = isActive !== undefined ? isActive : service.isActive;

      await service.save();

      res.json({
        success: true,
        message: 'Service updated successfully',
        service
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update service'
      });
    }
  }
);

// Delete service (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

module.exports = router;
