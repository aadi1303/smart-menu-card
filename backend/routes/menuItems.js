const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  shareMenuItem
} = require('../controllers/menuItemController');
const config = require('../config/config');

// --- Multer Configuration ---
// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', '..', config.upload.path);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // You can create a more unique filename if needed
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxSize
  },
  fileFilter: fileFilter
});

// --- Routes ---

// Route to create a new menu item
// Use the 'upload' middleware. 'image' is the field name from FormData.
router.post('/', upload.single('image'), createMenuItem);

// Route to get all menu items
router.get('/', getMenuItems);

// Route to get a specific menu item
router.get('/:id', getMenuItemById);

// Route to update a menu item
router.put('/:id', updateMenuItem);

// Route to delete a menu item
router.delete('/:id', deleteMenuItem);

// Route to generate WhatsApp share link
router.get('/:id/share', shareMenuItem);

module.exports = router;