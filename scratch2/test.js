const { Innertube, UniversalCache } = require('youtubei.js');

async function test() {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  
  // The video ID for Yeat - Back Home is likely needed. Let's find it.
  const videoId = 'fU7hZ3smj0g'; // random video id, or just 'U_V7wX6kQGA' for Back Home
  console.log("Video ID:", videoId);
  console.log("Video ID:", videoId);

  const upNext = await yt.music.getUpNext(videoId);
  console.log("Up Next filters:", upNext.filters?.map(f => f.title));
}

test().catch(console.error);
