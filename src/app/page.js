'use client';
import { useState } from 'react';
import SongSearch from '@/components/SongSearch';
import SeedList from '@/components/SeedList';
import RecommendationList from '@/components/RecommendationList';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [seedTracks, setSeedTracks] = useState([]);
  const [vibe, setVibe] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectSeed = (song) => {
    if (seedTracks.length >= 5) return;
    // prevent duplicates
    if (seedTracks.find(s => s.videoId === song.videoId)) return;
    
    setSeedTracks([...seedTracks, song]);
    setRecommendations([]);
  };

  const removeSeed = (index) => {
    const newSeeds = [...seedTracks];
    newSeeds.splice(index, 1);
    setSeedTracks(newSeeds);
    setRecommendations([]);
  };

  const fetchRecommendations = async () => {
    if (seedTracks.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seeds: seedTracks, vibe })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        console.error("Failed to fetch:", await res.text());
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
        Discover your next favorite track based on your exact vibe.
      </p>

      <SongSearch onSelect={handleSelectSeed} />

      {seedTracks.length > 0 && (
        <>
          <SeedList seeds={seedTracks} onRemove={removeSeed} />
          
          <div className="glass-panel animate-fade-in" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2>What's the vibe?</h2>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              Describe the mood (e.g. "slow and sad", "late night drive", "ethereal"). The first recommendation will always be Joji!
            </p>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Describe the vibe... (Optional)" 
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              style={{ maxWidth: '500px', marginBottom: '1.5rem' }}
            />
            
            <div>
              <button className="btn-primary" onClick={fetchRecommendations} disabled={loading}>
                {loading ? <Loader2 className="loader" /> : "Curate My Playlist"}
              </button>
            </div>
          </div>
        </>
      )}

      <RecommendationList recommendations={recommendations} />
    </main>
  );
}
