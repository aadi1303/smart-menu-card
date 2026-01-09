const MenuItem = require('../models/MenuItem');
const { processText, generateImage } = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const config = require('../config/config');

/**
 * Create a new menu item using AI text processing
 */
const createMenuItem = async (req, res) => {
  try {
    const { text, imageType = "ai" } = req.body;
    console.log("Received text:", text);

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required"
      });
    }

    // 1️⃣ Extract data using Groq
    const { title, description, price } = await processText(text);

    let imageUrl = null;
// 2️⃣ Image handling
if (imageType === "ai") {
  // ✅ Await the promise
  const generatedFileName = await generateImage(description); // returns filename like 42867d82-0dde-4ee2-b193-dcbb746c1566.png
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  imageUrl = `${baseUrl}/uploads/${generatedFileName}`; // prepend full URL
} else if (req.file) {
  const filename = `${uuidv4()}.webp`;
  const outputPath = path.join(config.upload.path, filename);

  await sharp(req.file.path)
    .resize(800, 600, { fit: "cover", position: "center" })
    .webp({ quality: 80 })
    .toFile(outputPath);

  fs.unlinkSync(req.file.path);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  imageUrl = `${baseUrl}/uploads/${filename}`; // prepend full URL
}

    // 3️⃣ Save item
    const menuItem = new MenuItem({
      title,
      description,
      price,
      originalText: text,
      imageUrl, // now correctly a string
      imageType
    });

    await menuItem.save();

    return res.status(201).json({
      success: true,
      data: menuItem
    });

  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};




/**
 * Get all menu items
 */
// controllers/menuItemController.js

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const menuItemsWithFullUrl = menuItems.map(item => {
      let imageUrl = item.imageUrl;

      // ✅ Only prepend if it's NOT already a full URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = baseUrl + imageUrl;
      }

      return {
        ...item.toObject(),
        imageUrl
      };
    });

    res.status(200).json({
      success: true,
      count: menuItemsWithFullUrl.length,
      data: menuItemsWithFullUrl
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};




/**
 * Get a single menu item by ID
 */
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Update a menu item
 */
const updateMenuItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    let menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Update fields
    if (title) menuItem.title = title;
    if (description) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    
    await menuItem.save();
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Delete a menu item
 */
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    await menuItem.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * Generate WhatsApp share link for a menu item
 */
const shareMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Get base URL from request or use default
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Generate WhatsApp share link
    const shareLink = generateShareLink(menuItem, baseUrl);
    
    res.status(200).json({
      success: true,
      data: {
        shareLink
      }
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  shareMenuItem
};