'use client';
import { X } from 'lucide-react';

export default function SeedList({ seeds, onRemove }) {
  if (!seeds || seeds.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h2>Your Seed Tracks</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        {seeds.map((seed, index) => (
          <div key={seed.videoId || index} className="track-card selected" style={{ width: '250px' }}>
            {seed.thumbnails && seed.thumbnails.length > 0 && (
              <img src={seed.thumbnails[0].url} alt={seed.name} className="track-img" style={{ width: '40px', height: '40px' }} />
            )}
            <div className="track-info" style={{ textAlign: 'left' }}>
              <div className="track-title" style={{ fontSize: '0.85rem' }}>{seed.name}</div>
              <div className="track-artist" style={{ fontSize: '0.75rem' }}>
                {seed.artist?.name || (Array.isArray(seed.artists) ? seed.artists.map(a => a.name).join(', ') : seed.artists)}
              </div>
            </div>
            <div className="btn-icon" onClick={() => onRemove(index)} style={{ marginLeft: 'auto', width: '24px', height: '24px' }}>
              <X size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
