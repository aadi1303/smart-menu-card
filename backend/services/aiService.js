const Groq = require("groq-sdk");
const { HfInference } = require("@huggingface/inference");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// --- Groq client ---
const groq = new Groq({ apiKey: config.groq.apiKey });

// --- Hugging Face client ---
const hf = new HfInference(config.huggingFace.apiKey);
console.log("Hugging Face API Key loaded.");

/**
 * Process natural language text using Groq
 */
const processText = async (text) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a professional Indian restaurant menu expert.
You understand Indian cuisine, portion sizes, ingredients, and current Indian market prices.
Respond ONLY in valid JSON.
          `
        },
        {
          role: "user",
          content: `
Analyze the following food input and generate detailed restaurant-quality information.

Food text: "${text}"

Rules:
- Assume the restaurant is located in INDIA
- Price must be realistic in INR (₹) based on 2025 Indian restaurant pricing
- Description must be appealing, professional, and food-focused
- Create an image generation prompt suitable for AI image models

Return JSON in this exact format:
{
  "title": "Professional dish name",
  "description": "Detailed, mouth-watering description (2–3 lines)",
  "price": number,
  "imagePrompt": "Ultra realistic food photography prompt, Indian restaurant style, studio lighting, high detail"
}
`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("Groq returned empty content");

    const parsed = JSON.parse(content);
    console.log("Groq processed successfully:", parsed);
    return parsed;
  } catch (err) {
    console.error("Groq error:", err);
    throw new Error("AI processing failed");
  }
};

/**
 * Generate image using Hugging Face
 * FRONTEND EXPECTS: imageUrl (string)
 */
const generateImage = async (prompt) => {
  try {
    console.log("🔥 generateImage called with prompt:", prompt);

    // HF text-to-image
    const result = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt
    });

    // Node.js: convert Blob to Buffer
    let buffer;
    if (result instanceof Blob) {
      buffer = Buffer.from(await result.arrayBuffer());
    } else {
      buffer = Buffer.from(result); // fallback if already ArrayBuffer / Uint8Array
    }

    // Save image locally
    const filename = `${uuidv4()}.png`;
    const filePath = path.join(config.upload.path, filename);

    if (!fs.existsSync(config.upload.path)) fs.mkdirSync(config.upload.path, { recursive: true });

    fs.writeFileSync(filePath, buffer);

    console.log("Image saved:", filename);
    return `/uploads/${filename}`; // RETURN STRING
  } catch (err) {
    console.error("Hugging Face image generation error:", err);

    // Fallback to Picsum
    const seed = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .slice(0, 5)
      .join("-");
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;
  }
};


module.exports = {
  processText,
  generateImage
};
