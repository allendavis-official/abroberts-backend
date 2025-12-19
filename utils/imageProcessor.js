const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const createThumbnail = async (imagePath) => {
  try {
    const filename = path.basename(imagePath);
    const dir = path.dirname(imagePath);
    const thumbDir = path.join(dir, 'thumbnails');
    
    // Ensure thumbnails directory exists
    await fs.mkdir(thumbDir, { recursive: true });
    
    const thumbnailPath = path.join(thumbDir, `thumb-${filename}`);
    
    // Create thumbnail (400px width, maintain aspect ratio)
    await sharp(imagePath)
      .resize(400, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
    
    return `/uploads/thumbnails/thumb-${filename}`;
  } catch (error) {
    console.error('Thumbnail creation error:', error);
    return null;
  }
};

const optimizeImage = async (imagePath) => {
  try {
    const tempPath = imagePath + '.temp';
    
    // Optimize image (max 1920px width)
    await sharp(imagePath)
      .resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85 })
      .toFile(tempPath);
    
    // Replace original with optimized
    await fs.rename(tempPath, imagePath);
    
    return true;
  } catch (error) {
    console.error('Image optimization error:', error);
    return false;
  }
};

module.exports = {
  createThumbnail,
  optimizeImage
};
