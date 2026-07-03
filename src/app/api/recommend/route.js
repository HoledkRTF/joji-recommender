import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import YTMusic from 'ytmusic-api';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const { seeds, vibe } = await request.json();

    if (!seeds || seeds.length === 0) {
      return NextResponse.json({ error: 'Seed tracks are required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }

    const seedNames = seeds.map(s => `${s.name} by ${s.artist?.name || (Array.isArray(s.artists) ? s.artists.map(a => a.name).join(', ') : s.artists)}`).join(', ');
    
    const prompt = `
You are an expert music curator. 
The user likes these seed songs: ${seedNames}.
${vibe ? `They want the recommendations to specifically match this vibe: "${vibe}".` : ''}

CRITICAL RULE: The very first song in the list MUST be a song by the artist "Joji" that fits the vibe. 
The remaining 9 songs should be closely related to the seed tracks and the requested vibe.

Return EXACTLY a JSON array of 10 objects. Each object must have a "title" string and an "artist" string.
Do NOT include any markdown formatting, backticks, or explanation. Just the raw JSON array.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text().trim();
    
    // Clean up possible markdown code blocks if the AI disobeyed
    if (aiResponse.startsWith('```')) {
      aiResponse = aiResponse.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    const curatedList = JSON.parse(aiResponse);

    // Now search YT Music for each curated song
    const ytmusic = new YTMusic();
    await ytmusic.initialize();

    const trackPromises = curatedList.map(async (item) => {
      try {
        const query = `${item.title} ${item.artist}`;
        const searchResults = await ytmusic.searchSongs(query);
        if (searchResults && searchResults.length > 0) {
          return searchResults[0];
        }
        return null;
      } catch (err) {
        console.error(`Error searching for ${item.title}:`, err);
        return null;
      }
    });

    const resolvedTracks = (await Promise.all(trackPromises)).filter(t => t !== null);

    return NextResponse.json(resolvedTracks);

  } catch (error) {
    console.error('Recommend error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
