import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import Farm from '../models/Farm';
import Conversation from '../models/Conversation';
import Message from '../models/Message';

const systemPromptTemplate = `You are AgriGPT, an advanced AI Agriculture Copilot.
You act as a unified interface for all agricultural services. You must provide rich, visual responses whenever helpful (e.g., when asked for comparisons, analytics, shopping, or weather).

USER CONTEXT:
{{USER_CONTEXT}}

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
`;

export const chat = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { messages, conversationId } = req.body;
    const userId = (req as any).user?.id; // Optional if not logged in

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format." });
    }

    let farmContext = "No farm profile available.";
    if (userId) {
      const farm = await Farm.findOne({ userId } as any);
      if (farm) {
        farmContext = `Farm Name: ${farm.name}\nLocation: ${farm.location?.district}, ${farm.location?.state}\nTotal Area: ${farm.totalAreaInAcres} acres`;
      }
    }

    const systemInstruction = systemPromptTemplate.replace('{{USER_CONTEXT}}', farmContext);

    const tools: any[] = [
      {
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
      }
    ] as any;

    let formattedMessages: any[] = messages.map((msg: any) => ({
       role: msg.role === 'user' ? 'user' : 'model',
       parts: [{ text: msg.content }]
    }));

    // If there's a new user message, let's capture it
    const lastUserMessage = messages[messages.length - 1];
    let convId = conversationId;

    if (userId && lastUserMessage && lastUserMessage.role === 'user') {
      if (!convId) {
        const conv = new Conversation({
          userId,
          title: lastUserMessage.content.substring(0, 40) + "..."
        });
        await conv.save();
        convId = conv._id.toString();
      }

      await new Message({
        conversationId: convId,
        role: 'user',
        content: lastUserMessage.content
      }).save();
    }

    let isDone = false;
    let retries = 3;
    let fullResponseText = "";

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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // We send conversationId as an initial meta-data payload
    if (convId) {
        res.write(`data: ${JSON.stringify({ meta: { conversationId: convId } })}\n\n`);
    }

    try {
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: formattedMessages,
        config: { systemInstruction: systemInstruction }
      });
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponseText += chunk.text;
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write(`data: [DONE]\n\n`);
      res.end();

      // Save AI response to DB
      if (userId && convId && fullResponseText) {
          await new Message({
            conversationId: convId,
            role: 'model',
            content: fullResponseText
          }).save();
      }
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to generate response." });
    }
  }
};
