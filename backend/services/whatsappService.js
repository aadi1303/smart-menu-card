const config = require('../config/config');

/**
 * Generate a WhatsApp sharing link with menu item details
 * @param {Object} menuItem - Menu item object
 * @param {string} baseUrl - Base URL of the application
 * @returns {string} - WhatsApp sharing link
 */
const generateShareLink = (menuItem, baseUrl) => {
  try {
    const { title, description, price, _id } = menuItem;
    
    // Create the message
    const message = `*${title}*\n\n${description}\n\nPrice: $${price.toFixed(2)}\n\nOrder now: ${baseUrl}/menu/${_id}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
    
    return whatsappLink;
  } catch (error) {
    console.error('Error generating WhatsApp share link:', error);
    throw new Error('Failed to generate WhatsApp share link');
  }
};

module.exports = {
  generateShareLink
};