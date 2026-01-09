module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/smartmenu'
  },
  // --- UPDATE THIS SECTION ---
  groq: {
    apiKey: process.env.GROQ_API_KEY
  },
  huggingFace: {
    apiKey: process.env.HUGGINGFACE_API_KEY
  },
  // ---------------------------
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY
  },
  upload: {
    path: process.env.UPLOAD_PATH || 'uploads/',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
};