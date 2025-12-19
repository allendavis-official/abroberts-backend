const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Page = require('../models/Page');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@abroberts.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
    } else {
      const admin = new User({
        email: 'admin@abroberts.com',
        password: 'Admin@123456', // CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
      console.log('📧 Email: admin@abroberts.com');
      console.log('🔑 Password: Admin@123456');
      console.log('⚠️  PLEASE CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN');
    }

    // Create default settings
    const contactInfo = await Settings.findOne({ key: 'contact_info' });
    if (!contactInfo) {
      await Settings.create({
        key: 'contact_info',
        value: {
          address: '123 Main Street, Monrovia, Liberia',
          phone: '+231-XXX-XXXX',
          email: 'info@abroberts.com',
          mapEmbedUrl: ''
        }
      });
      console.log('✅ Contact info settings created');
    }

    const businessHours = await Settings.findOne({ key: 'business_hours' });
    if (!businessHours) {
      await Settings.create({
        key: 'business_hours',
        value: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '9:00 AM - 1:00 PM',
          sunday: 'Closed'
        }
      });
      console.log('✅ Business hours settings created');
    }

    // Create default pages
    const homeExists = await Page.findOne({ slug: 'home' });
    if (!homeExists) {
      await Page.create({
        slug: 'home',
        title: 'Welcome to A.B. Roberts Funeral Home',
        sections: [
          {
            sectionId: 'hero',
            heading: 'Serving Families with Dignity and Compassion',
            content: '<p>Professional funeral services in Liberia</p>',
            imageUrl: '',
            order: 1
          },
          {
            sectionId: 'intro',
            heading: 'About Our Services',
            content: '<p>We provide comprehensive funeral services to families in their time of need.</p>',
            imageUrl: '',
            order: 2
          }
        ],
        metaDescription: 'Professional funeral services in Liberia'
      });
      console.log('✅ Home page created');
    }

    const aboutExists = await Page.findOne({ slug: 'about' });
    if (!aboutExists) {
      await Page.create({
        slug: 'about',
        title: 'About A.B. Roberts Funeral Home',
        sections: [
          {
            sectionId: 'history',
            heading: 'Our History',
            content: '<p>Founded with a commitment to serving families with dignity and respect.</p>',
            imageUrl: '',
            order: 1
          },
          {
            sectionId: 'mission',
            heading: 'Mission & Vision',
            content: '<p>Our mission is to provide compassionate and professional funeral services.</p>',
            imageUrl: '',
            order: 2
          }
        ],
        metaDescription: 'Learn about A.B. Roberts Funeral Home'
      });
      console.log('✅ About page created');
    }

    const contactExists = await Page.findOne({ slug: 'contact' });
    if (!contactExists) {
      await Page.create({
        slug: 'contact',
        title: 'Contact Us',
        sections: [
          {
            sectionId: 'intro',
            heading: 'Get in Touch',
            content: '<p>We are here to help you during this difficult time.</p>',
            imageUrl: '',
            order: 1
          }
        ],
        metaDescription: 'Contact A.B. Roberts Funeral Home'
      });
      console.log('✅ Contact page created');
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login at /admin/login');
    console.log('3. Change the admin password immediately');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
