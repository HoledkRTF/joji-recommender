'use client';
import { Play } from 'lucide-react';

export default function RecommendationList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in">
      <h2>Recommended for You</h2>
      <div className="grid-results">
        {recommendations.map((song, index) => (
          <a 
            key={song.videoId || index} 
            href={`https://music.youtube.com/watch?v=${song.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="track-card animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {song.thumbnail && (
              <img src={song.thumbnail} alt={song.title} className="track-img" />
            )}
            <div className="track-info">
              <div className="track-title">{song.title}</div>
              <div className="track-artist">{Array.isArray(song.artists) ? song.artists.map(a => a.name).join(', ') : song.artists}</div>
            </div>
            <div className="btn-icon">
              <Play size={16} fill="currentColor" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
