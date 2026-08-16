const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        "Describe this image",
        { inlineData: { data: base64Data, mimeType: "image/png" } }
      ]
    });
    console.log("Response:", response.text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
