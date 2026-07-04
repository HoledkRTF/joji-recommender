require('dotenv').config({ path: '../.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log("API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  
  const seedNames = "Heat Waves by Glass Animals";
  const vibe = "";

  const prompt = `
You are an expert music curator. 
The user likes these seed songs: ${seedNames}.
${vibe ? `They want the recommendations to specifically match this vibe: "${vibe}".` : ''}

CRITICAL RULE: The very first song in the list MUST be a song by the artist "Joji" that fits the vibe. 
The remaining 9 songs should be closely related to the seed tracks and the requested vibe.

Return EXACTLY a JSON array of 10 objects. Each object must have a "title" string and an "artist" string.
Do NOT include any markdown formatting, backticks, or explanation. Just the raw JSON array.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
  const result = await model.generateContent(prompt);
  let aiResponse = result.response.text().trim();
  
  console.log("Raw AI Response:\n", aiResponse);

  try {
    if (aiResponse.startsWith('```')) {
      aiResponse = aiResponse.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }
    const parsed = JSON.parse(aiResponse);
    console.log("Parsed correctly. First item:", parsed[0]);
  } catch(e) {
    console.error("Failed to parse JSON:", e);
  }
}

test().catch(console.error);
