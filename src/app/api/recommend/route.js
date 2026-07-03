import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Query parameter "videoId" is required' }, { status: 400 });
  }

  try {
    const ytmusic = new YTMusic();
    await ytmusic.initialize();
    
    // getUpNexts returns the radio queue / recommendations for a given seed track
    const recommendations = await ytmusic.getUpNexts(videoId);
    
    // Sometimes the first track in UpNext is the seed itself.
    // The frontend can filter it out, or we can just pass the whole array.
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommend error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
