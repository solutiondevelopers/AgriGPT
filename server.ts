import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";

let isMongoConnected = false;

const chatSessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: String,
  lastMessage: String,
  messageCount: Number,
  language: String,
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now }
});

const diseaseScanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  crop: String,
  disease: String,
  healthStatus: String,
  confidence: Number,
  confidenceLevel: String,
  severity: String,
  language: String,
  fullResult: Object,
  createdAt: { type: Number, default: Date.now }
});

const seedQualityScanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  seedType: String,
  overallQualityScore: Number,
  viabilityEstimate: String,
  purityPercentage: Number,
  fullResult: Object,
  createdAt: { type: Number, default: Date.now }
});

const ChatSessionModel = mongoose.models.ChatSession || mongoose.model("ChatSession", chatSessionSchema);
const DiseaseScanModel = mongoose.models.DiseaseScan || mongoose.model("DiseaseScan", diseaseScanSchema);
const SeedQualityScanModel = mongoose.models.SeedQualityScan || mongoose.model("SeedQualityScan", seedQualityScanSchema);

async function connectMongoDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("ℹ️ MONGODB_URI not provided. Skipping MongoDB Atlas auto-connect.");
    return;
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB Atlas!");
  } catch (err: any) {
    console.warn("⚠️ MongoDB Atlas connection notice (application running normally):", err.message);
  }
}

async function startServer() {
  await connectMongoDB();
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // MongoDB Status Endpoint
  app.get("/api/db/status", (req, res) => {
    res.json({
      connected: isMongoConnected,
      uriConfigured: !!process.env.MONGODB_URI,
      database: "MongoDB Atlas"
    });
  });

  // API endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format." });
      }

      const openrouterKey = process.env.OPENROUTER_API_KEY || "";
      const geminiKey = process.env.GEMINI_API_KEY;

      if (!openrouterKey && !geminiKey) {
        return res.status(500).json({ error: "Neither OpenRouter nor Gemini API key is configured on the server." });
      }

      const systemInstruction = `You are AgriGPT, an advanced AI Agriculture Copilot.
You act as a unified interface for all agricultural services. You must provide rich, visual responses whenever helpful (e.g., when asked for comparisons, analytics, shopping, or weather).

To render visual components in the UI, you MUST output a JSON block with a specific language tag.

1. To show a chart (for comparisons, yields, prices, analytics), use the \`\`\`json:chart tag:
\`\`\`json:chart
{
  "type": "bar", // Can be "bar", "line", "area", "pie", "scatter", "heatmap", "calendar"
  "title": "Crop Profitability Comparison",
  "data": [
    { "name": "Wheat", "value": 400 },
    { "name": "Soybean", "value": 600 }
  ],
  "dataKey": "value",
  "xAxisKey": "name",
  "color": "#10b981"
}
\`\`\`
For heatmap or calendar, use this data format:
\`\`\`json:chart
{
  "type": "heatmap",
  "title": "Water Usage (Weekly)",
  "maxValue": 100,
  "color": "#3b82f6",
  "data": [
    { "label": "Mon", "values": [20, 40, 60, 80, 10] },
    { "label": "Tue", "values": [30, 50, 70, 90, 20] }
  ]
}
\`\`\`
For scatter plots, use this data format:
\`\`\`json:chart
{
  "type": "scatter",
  "title": "Yield vs Fertilizer",
  "data": [
    { "x": 10, "y": 200, "z": 100 },
    { "x": 20, "y": 250, "z": 200 }
  ],
  "dataKey": "Yield",
  "xAxisKey": "Fertilizer",
  "color": "#8b5cf6"
}
\`\`\`

2. To show weather data, use the \`\`\`json:weather tag:
\`\`\`json:weather
{
  "location": "Current Location",
  "temperature": "28°C",
  "condition": "Partly Cloudy",
  "humidity": "65%",
  "wind": "12 km/h",
  "forecast": "Light rain expected this evening."
}
\`\`\`

3. To show products or marketplace items (when the user wants to buy/sell), use the \`\`\`json:products tag:
\`\`\`json:products
{
  "items": [
    { "name": "Premium Wheat Seeds (50kg)", "price": "₹3800", "supplier": "AgroCorp", "rating": 4.8, "reviews": 120, "inventory": 50, "description": "High yield variety seeds." },
    { "name": "Organic Fertilizer (20L)", "price": "₹2500", "supplier": "EcoFarm", "rating": 4.5, "reviews": 85, "inventory": 12, "description": "100% organic liquid fertilizer." }
  ]
}
\`\`\`

\`\`\`json:followup
{
  "questions": [
    "How does this compare to last month?",
    "What is the forecast for next week?"
  ]
}
\`\`\`

\`\`\`json:map
{
  "lat": 18.5204,
  "lng": 73.8567,
  "title": "Pune, Maharashtra"
}
\`\`\`

\`\`\`json:order_tracking
{
  "orderId": "ORD-7829-XP",
  "status": "Shipped",
  "estimatedDelivery": "Tomorrow, by 8:00 PM",
  "update": "Package has arrived at the local sorting facility."
}
\`\`\`

4. To collect data from the user (like a survey, feedback, or test request), use the \`\`\`json:form tag:
\`\`\`json:form
{
  "title": "Soil Test Request",
  "fields": [
    { "name": "area", "label": "Area (Acres)", "type": "number", "required": true },
    { "name": "crop", "label": "Current Crop", "type": "text" }
  ],
  "submitLabel": "Request Test"
}
\`\`\`

5. To navigate the user to a different feature or page of the application, use the \`\`\`json:navigate tag. Available paths are: /weather (Weather), /store (AgroStore), /analytics (Analytics), /3d-view (3D Farm View), /scan (Disease Scan).
\`\`\`json:navigate
{
  "path": "/weather",
  "label": "Weather Dashboard"
}
\`\`\`

Always include conversational text explaining your reasoning, confidence level, and suggestions alongside these visual blocks. If the user asks to buy something, provide the products block. If they ask for location or maps, provide a map block. If they ask to track an order, provide the order_tracking block. If they need to fill out a form, provide the form block.
If the user asks for analytics (e.g. Revenue, Expenses, Yield, Water Usage, Fertilizer Usage, Market Trends, Weather Trends), automatically choose the best chart type (line, bar, pie, scatter, heatmap, calendar) and provide a chart block. For example, use a line chart for Revenue Trend, heatmap for Weekly Water Usage, pie chart for Expenses Breakdown, or scatter plot for Yield vs. Fertilizer.
If the user asks to open or view a specific dashboard/feature, always output the navigate block so the UI can open it for them.
At the end of EVERY response, try to provide a followup block with 2-3 logical next questions the user might want to ask.`;

      // Priority 1: Gemini SDK if key available
      if (geminiKey) {
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        // Format messages for Gemini API
        let formattedMessages: any[] = messages.map((msg: any) => ({
           role: msg.role === 'user' ? 'user' : 'model',
           parts: [{ text: msg.content }]
        }));

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
          const stream = await ai.models.generateContentStream({
            model: "gemini-3.1-flash-lite",
            contents: formattedMessages,
            config: { systemInstruction: systemInstruction }
          });
          
          for await (const chunk of stream) {
            if (chunk.text) {
              res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            }
          }
          res.write(`data: [DONE]\n\n`);
          return res.end();
        } catch (error: any) {
          console.error("Gemini stream error:", error);
          if (!res.headersSent) {
            return res.status(500).json({ error: "Stream failed: " + error.message });
          } else {
            res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
            return res.end();
          }
        }
      }

      // Fallback: OpenRouter API if key available
      if (openrouterKey) {
        const candidateModels = [
          "openrouter/auto",
          "google/gemini-2.5-flash-exp:free",
          "google/gemini-flash-1.5",
          "meta-llama/llama-3.3-70b-instruct:free",
          "meta-llama/llama-3.3-70b-instruct",
          "openai/gpt-4o-mini",
          "deepseek/deepseek-chat"
        ];

        for (const modelName of candidateModels) {
          try {
            const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${openrouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://agrigpt.app",
                "X-Title": "AgriGPT"
              },
              body: JSON.stringify({
                model: modelName,
                messages: [
                  { role: "system", content: systemInstruction },
                  ...messages.map((msg: any) => ({
                    role: msg.role === "user" ? "user" : "assistant",
                    content: msg.content
                  }))
                ],
                stream: true
              })
            });

            if (openRouterRes.ok && openRouterRes.body) {
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');

              const reader = (openRouterRes.body as any).getReader();
              const decoder = new TextDecoder("utf-8");
              let buffer = "";

              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed || trimmed.startsWith(":")) continue;
                  if (trimmed === "data: [DONE]") {
                    res.write(`data: [DONE]\n\n`);
                    break;
                  }
                  if (trimmed.startsWith("data: ")) {
                    try {
                      const parsed = JSON.parse(trimmed.slice(6));
                      const textChunk = parsed.choices?.[0]?.delta?.content;
                      if (textChunk) {
                        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
                      }
                    } catch (e) {
                      // ignore invalid json chunks
                    }
                  }
                }
              }
              res.write(`data: [DONE]\n\n`);
              return res.end();
            } else {
              const errText = await openRouterRes.text();
              console.error(`OpenRouter model ${modelName} returned status ${openRouterRes.status}:`, errText);
            }
          } catch (orErr) {
            console.error(`OpenRouter fetch error with model ${modelName}:`, orErr);
          }
        }
      }

      if (!res.headersSent) {
        return res.status(500).json({ error: "Unable to generate AI response from available providers." });
      }
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "Failed to generate response." });
    }
  });

  // AI Vision: Disease Scan
  app.post("/api/disease-scan", async (req, res) => {
    try {
      const { image, crop, location, growthStage, description, language } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: "Gemini API Key is missing. Vision requires Gemini." });
      }

      
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      // Strip data url prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      const prompt = `
You are an expert agricultural plant pathologist and your AI model has been trained with 90% accuracy on a massive dataset of over 500+ crop varieties spanning diseases, pests, and nutrient deficiencies. Analyze this image of a plant/crop.
Crop context: ${crop || 'Unknown'}
Location: ${location || 'Unknown'}
Stage: ${growthStage || 'Unknown'}
Additional details: ${description || 'None'}
Language requested for analysis: ${language || 'en'}

Respond ONLY with a valid JSON object matching this schema exactly (no markdown formatting, no code blocks):
{
  "isPlantImage": boolean,
  "crop": "detected crop name",
  "healthStatus": "healthy | diseased | pest_damage | nutrient_deficiency | environmental_stress | unknown",
  "possibleDisease": "disease name or None",
  "confidence": 0.0 to 1.0,
  "confidenceLevel": "High | Moderate | Low",
  "severity": "None | Low | Moderate | High | Severe",
  "symptoms": ["list", "of", "symptoms"],
  "reasoning": ["list", "of", "reasons"],
  "recommendedActions": ["list", "of", "actions"],
  "prevention": ["list", "of", "prevention steps"],
  "needsExpertConfirmation": boolean,
  "disclaimer": "AI is for informational purposes..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        config: {
          responseMimeType: "application/json"
        },
        contents: [
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]
      });

      let jsonStr = response.text || "{}";
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(jsonStr);

      res.json(result);
    } catch (error) {
      console.error("Error in /api/disease-scan:", error);
      res.status(500).json({ error: "Failed to analyze image: " + error.message });
    }
  });

  // AI Vision: Seed Quality Scan
  app.post("/api/seed-quality", async (req, res) => {
    try {
      const { image, seedType, language } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(500).json({ error: "Gemini API Key is missing. Vision requires Gemini." });
      }

      
      const ai = new GoogleGenAI({ apiKey: geminiKey });

      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      const prompt = `
You are an expert seed quality analyst model trained with 90% accuracy on a massive dataset of over 500+ crop varieties spanning viability, physical purity, and defect rates.
Analyze this image of seeds.
Seed type context: ${seedType || 'Unknown'}
Language requested for analysis: ${language || 'en'}

Assess the quality of the seeds based on visible characteristics like color, physical damage, uniformity, shriveling, and potential mold/fungus.
Respond ONLY with a valid JSON object matching this schema exactly (no markdown formatting, no code blocks):
{
  "isSeedImage": boolean,
  "seedType": "detected seed type",
  "overallQualityScore": 0 to 100,
  "viabilityEstimate": "High | Moderate | Low (e.g. estimate of germination success)",
  "purityPercentage": 0 to 100,
  "defectRate": "percentage of broken/discolored seeds",
  "moistureEstimate": "description of moisture/dryness",
  "observations": ["list", "of", "visual", "observations"],
  "recommendation": "Overall advice (e.g., 'Good for premium market', 'Requires sorting')",
  "disclaimer": "AI is for informational purposes..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        config: {
          responseMimeType: "application/json"
        },
        contents: [
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]
      });

      let jsonStr = response.text || "{}";
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(jsonStr);

      res.json(result);
    } catch (error) {
      console.error("Error in /api/seed-quality:", error);
      res.status(500).json({ error: "Failed to analyze seed image: " + error.message });
    }
  });

  app.post("/api/translate", async (req, res) => {
    try {
      const { text, source_language_code, target_language_code } = req.body;
      const key = process.env.SARVAM_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "SARVAM_API_KEY not configured" });
      }
      const response = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
          "api-subscription-key": key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: text,
          source_language_code: source_language_code || "en-IN",
          target_language_code: target_language_code || "hi-IN",
          speaker_gender: "Male",
          mode: "formal",
          model: "sarvam-translate:v1"
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Translation API failed: " + errorText);
      }
      const data = await response.json();
      res.json({ translated_text: data.translated_text });
    } catch (e) {
      console.error("Translate error:", e);
      res.status(500).json({ error: e.message || "Translation failed" });
    }
  });


  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
