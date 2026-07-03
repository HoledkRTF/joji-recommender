'use client';
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function SongSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to search', error);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-glass" 
          placeholder="Search for a song..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Loader2 className="loader" /> : <Search />} Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid-results">
          {results.map((song) => (
            <div 
              key={song.videoId} 
              className="track-card animate-fade-in" 
              onClick={() => {
                onSelect(song);
                setQuery('');
                setResults([]);
              }}
            >
              {song.thumbnails && song.thumbnails.length > 0 && (
                <img src={song.thumbnails[0].url} alt={song.name} className="track-img" />
              )}
              <div className="track-info">
                <div className="track-title">{song.name}</div>
                <div className="track-artist">{song.artist?.name || (Array.isArray(song.artists) ? song.artists.map(a => a.name).join(', ') : song.artists)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
