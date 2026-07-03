const YTMusic = require("ytmusic-api");

async function test() {
  const ytmusic = new YTMusic();
  await ytmusic.initialize();

  const vibe = "slow sad";
  const song = "Back Home Yeat";
  const query = `${vibe} like ${song}`;
  console.log(`Searching playlists for:`, query);
  
  const playlists = await ytmusic.searchPlaylists(query);
  console.log("Found Playlists:", playlists.slice(0, 2).map(p => p.name));

  if (playlists.length > 0) {
    const playlistData = await ytmusic.getPlaylistVideos(playlists[0].playlistId);
    console.log("Playlist Tracks:", playlistData.slice(0, 5).map(s => s.name + ' - ' + (Array.isArray(s.artists) ? s.artists.map(a => a.name).join(', ') : s.artists)));
  }
}

test().catch(console.error);
