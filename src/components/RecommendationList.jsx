'use client';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

function TrackCard({ song, index }) {
  const [trackData, setTrackData] = useState(null);

  useEffect(() => {
    async function fetchTrackData() {
      try {
        const query = `${song.title} ${song.artist}`;
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (res.ok) {
          const data = await res.json();
          setTrackData(data);
        }
      } catch (err) {
        console.error("Failed to load track data", err);
      }
    }
    fetchTrackData();
  }, [song]);

  const displayTitle = trackData?.name || song.title;
  const displayArtist = trackData?.artist?.name || (Array.isArray(trackData?.artists) ? trackData.artists.map(a => a.name).join(', ') : (trackData?.artists || song.artist));
  const thumbnailUrl = trackData?.thumbnails?.[1]?.url || trackData?.thumbnails?.[0]?.url;

  return (
    <a 
      key={trackData?.videoId || index} 
      href={trackData?.videoId ? `https://music.youtube.com/watch?v=${trackData.videoId}` : '#'}
      target={trackData?.videoId ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`track-card animate-fade-in ${!trackData ? 'loading-pulse' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={displayTitle} className="track-img" />
      ) : (
        <div className="track-img" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
      )}
      <div className="track-info" style={{ textAlign: 'left' }}>
        <div className="track-title">{displayTitle}</div>
        <div className="track-artist">{displayArtist}</div>
      </div>
      <div className="btn-icon">
        <Play size={16} fill="currentColor" />
      </div>
    </a>
  );
}

export default function RecommendationList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Recommended for You</h2>
      <div className="grid-results">
        {recommendations.map((song, index) => (
          <TrackCard key={index} song={song} index={index} />
        ))}
      </div>
    </div>
  );
}
