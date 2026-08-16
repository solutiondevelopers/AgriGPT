const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

const translateEndpoint = `
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
`;

if (!server.includes('/api/translate')) {
  server = server.replace('app.listen(PORT', translateEndpoint + '\n  app.listen(PORT');
  fs.writeFileSync('server.ts', server);
  console.log('Added /api/translate endpoint');
} else {
  console.log('Endpoint already exists');
}
