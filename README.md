# A.B. Roberts Funeral Home - Backend API

This is the backend API for the A.B. Roberts Funeral Home website.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/abroberts?retryWrites=true&w=majority

# JWT Secret (generate a random string - minimum 32 characters)
JWT_SECRET=your_very_secure_random_jwt_secret_here_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload Settings
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

**Important:** Generate a strong JWT_SECRET. You can use this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Create Upload Directories

```bash
mkdir uploads
mkdir uploads/thumbnails
```

### 4. Seed Initial Data

Run the seed script to create:
- Admin user (admin@abroberts.com / Admin@123456)
- Default settings
- Default pages

```bash
npm run seed:admin
```

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 6. Test the API

Visit `http://localhost:5000/api/health` to verify the API is running.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token
- `PUT /api/auth/password` - Change password (protected)

### Pages
- `GET /api/pages/:slug` - Get page by slug (public)
- `GET /api/pages` - Get all pages (admin)
- `PUT /api/pages/:slug` - Update page (admin)

### Services
- `GET /api/services` - Get active services (public)
- `GET /api/services/admin/all` - Get all services (admin)
- `GET /api/services/:id` - Get single service (admin)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Gallery
- `GET /api/gallery` - Get gallery images (public)
- `POST /api/gallery` - Upload image (admin)
- `PUT /api/gallery/:id` - Update image (admin)
- `PATCH /api/gallery/:id/reorder` - Reorder image (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Staff
- `GET /api/staff` - Get active staff (public)
- `GET /api/staff/admin/all` - Get all staff (admin)
- `GET /api/staff/:id` - Get single staff member (admin)
- `POST /api/staff` - Create staff member (admin)
- `PUT /api/staff/:id` - Update staff member (admin)
- `DELETE /api/staff/:id` - Delete staff member (admin)

### Contact
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all contacts (admin)
- `GET /api/contact/:id` - Get single contact (admin)
- `PATCH /api/contact/:id/read` - Mark as read/unread (admin)
- `DELETE /api/contact/:id` - Delete contact (admin)

### Settings
- `GET /api/settings/:key` - Get setting by key (public)
- `GET /api/settings` - Get all settings (admin)
- `PUT /api/settings/:key` - Update setting (admin)

## Deployment

### Railway Deployment

1. Create a Railway project
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

## Default Admin Credentials

**Email:** admin@abroberts.com  
**Password:** Admin@123456

**⚠️ Change this password immediately after first login!**

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed:admin` - Create admin user and seed initial data

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Sharp for image processing
- bcryptjs for password hashing

## Support

For issues or questions, please contact the development team.
