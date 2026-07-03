'use client';
import { useState } from 'react';
import SongSearch from '@/components/SongSearch';
import RecommendationList from '@/components/RecommendationList';
import { Loader2, X } from 'lucide-react';

export default function Home() {
  const [seedTrack, setSeedTrack] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectSeed = (song) => {
    setSeedTrack(song);
    // Clear previous recommendations when selecting a new seed
    setRecommendations([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSeed = () => {
    setSeedTrack(null);
    setRecommendations([]);
  };

  const fetchRecommendations = async () => {
    if (!seedTrack) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/recommend?videoId=${seedTrack.videoId}`);
      if (res.ok) {
        const data = await res.json();
        // The first track might be the seed itself, we can filter it out, but let's just display all.
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    }
    setLoading(false);
  };

  return (
    <main className="container animate-fade-in">
      <h1 style={{ textAlign: 'center' }}>AI Song Recommender</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'rgba(255,255,255,0.7)' }}>
        Discover your next favorite track based on what you already love.
      </p>

      {!seedTrack ? (
        <SongSearch onSelect={handleSelectSeed} />
      ) : (
        <div className="glass-panel animate-fade-in" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2>Your Seed Track</h2>
          <div className="track-card selected" style={{ display: 'inline-flex', maxWidth: '400px', margin: '1rem auto' }}>
             {seedTrack.thumbnails && seedTrack.thumbnails.length > 0 && (
                <img src={seedTrack.thumbnails[0].url} alt={seedTrack.name} className="track-img" />
              )}
              <div className="track-info" style={{ textAlign: 'left' }}>
                <div className="track-title">{seedTrack.name}</div>
                <div className="track-artist">{seedTrack.artist?.name || (Array.isArray(seedTrack.artists) ? seedTrack.artists.map(a => a.name).join(', ') : seedTrack.artists)}</div>
              </div>
              <div className="btn-icon" onClick={clearSeed} style={{ marginLeft: 'auto' }}>
                <X size={16} />
              </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn-primary" onClick={fetchRecommendations} disabled={loading}>
              {loading ? <Loader2 className="loader" /> : "Get Recommendations"}
            </button>
          </div>
        </div>
      )}

      <RecommendationList recommendations={recommendations} />
    </main>
  );
}
