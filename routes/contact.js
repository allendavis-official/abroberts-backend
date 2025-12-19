const express = require('express');
const { body } = require('express-validator');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Submit contact form (public)
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      const contact = new Contact({
        name,
        email,
        phone: phone || '',
        message
      });

      await contact.save();

      res.status(201).json({
        success: true,
        message: 'Thank you for contacting us. We will respond shortly.'
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit contact form'
      });
    }
  }
);

// Get all contacts (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { isRead } = req.query;
    const query = isRead !== undefined ? { isRead: isRead === 'true' } : {};

    const contacts = await Contact.find(query).sort({ submittedAt: -1 });

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts'
    });
  }
});

// Get single contact (admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact'
    });
  }
});

// Mark contact as read/unread (admin)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { isRead } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.isRead = isRead !== undefined ? isRead : true;
    contact.readAt = contact.isRead ? new Date() : null;

    await contact.save();

    res.json({
      success: true,
      message: `Contact marked as ${contact.isRead ? 'read' : 'unread'}`,
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// Delete contact (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

module.exports = router;
