import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format." });
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
    { "name": "Premium Wheat Seeds (50kg)", "price": "$45.00", "supplier": "AgroCorp", "rating": 4.8, "reviews": 120, "inventory": 50, "description": "High yield variety seeds." },
    { "name": "Organic Fertilizer (20L)", "price": "$30.00", "supplier": "EcoFarm", "rating": 4.5, "reviews": 85, "inventory": 12, "description": "100% organic liquid fertilizer." }
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

Always include conversational text explaining your reasoning, confidence level, and suggestions alongside these visual blocks. If the user asks to buy something, provide the products block. If they ask for location or maps, provide a map block. If they ask to track an order, provide the order_tracking block. If they need to fill out a form, provide the form block.
If the user asks for analytics (e.g. Revenue, Expenses, Yield, Water Usage, Fertilizer Usage, Market Trends, Weather Trends), automatically choose the best chart type (line, bar, pie, scatter, heatmap, calendar) and provide a chart block. For example, use a line chart for Revenue Trend, heatmap for Weekly Water Usage, pie chart for Expenses Breakdown, or scatter plot for Yield vs. Fertilizer.
At the end of EVERY response, try to provide a followup block with 2-3 logical next questions the user might want to ask.`;

      // Define available tools
      const tools: any = [{
        functionDeclarations: [
          {
            name: "get_weather",
            description: "Get current weather and forecast for a location",
            parameters: {
              type: "OBJECT",
              properties: {
                location: {
                  type: "STRING",
                  description: "The city or region, e.g., 'Pune, Maharashtra'"
                }
              },
              required: ["location"]
            }
          },
          {
            name: "get_market_prices",
            description: "Get current market prices for crops",
            parameters: {
              type: "OBJECT",
              properties: {
                crop: {
                  type: "STRING",
                  description: "The name of the crop, e.g., 'Wheat', 'Soybean'"
                }
              },
              required: ["crop"]
            }
          }
        ]
      }];

      // Format messages for Gemini API
      let formattedMessages: any[] = messages.map((msg: any) => ({
         role: msg.role === 'user' ? 'user' : 'model',
         parts: [{ text: msg.content }]
      }));

      // To handle streaming properly with function calls:
      // We will loop with regular generateContent for tool calls.
      // Once it doesn't return tool calls, we will stream the final text.
      
      let isDone = false;
      let finalStream = null;
      let retries = 3;

      while (!isDone && retries > 0) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: formattedMessages,
            config: {
               systemInstruction: systemInstruction,
               tools: tools,
            }
          });

          const functionCalls = response.functionCalls;
          if (functionCalls && functionCalls.length > 0) {
            formattedMessages.push({
              role: "model",
              parts: functionCalls.map(fc => ({ functionCall: fc }))
            });

            const functionResponses = [];
            for (const call of functionCalls) {
              const name = call.name;
              let result: any = { error: "Unknown tool" };
              if (name === "get_weather") {
                result = { temperature: "28°C", condition: "Partly Cloudy" };
              } else if (name === "get_market_prices") {
                result = { price: "$400 per ton", trend: "up 5%" };
              }
              functionResponses.push({
                functionResponse: { name, response: result }
              });
            }
            formattedMessages.push({ role: "user", parts: functionResponses });
          } else {
            isDone = true;
          }
        } catch (e: any) {
          retries--;
          if (retries === 0) throw e;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Now stream the final response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const stream = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: formattedMessages,
          config: { systemInstruction: systemInstruction }
        });
        
        for await (const chunk of stream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
      } catch (error) {
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
        res.end();
      }
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: error.message || "Failed to generate response." });
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
