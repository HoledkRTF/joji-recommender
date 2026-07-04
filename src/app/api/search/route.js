import { NextResponse } from 'next/server';
import YTMusic from 'ytmusic-api';

let globalYTMusic = null;

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!globalYTMusic) {
      globalYTMusic = new YTMusic();
      await globalYTMusic.initialize();
    }

    const searchResults = await globalYTMusic.searchSongs(query);
    
    if (searchResults && searchResults.length > 0) {
      return NextResponse.json(searchResults[0]);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
