import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';
import LoadingScreen from '../components/LoadingScreen';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STYLES = ['cultural', 'adventure', 'relaxed', 'family'];
const ICONS = { cultural: '🏛️', adventure: '🏔️', relaxed: '🏖️', family: '👨‍👩‍👧‍👦' };
const EXAMPLES = [
  '7-day cultural trip to Japan for 2 people, budget $4000, in July',
  '5-day relaxed beach holiday in Bali for a couple, budget $2500',
  '10-day adventure trip to Turkey for 3 people, budget $6000',
  'Family trip to Paris for 4 people, 6 days, budget $5000 in August'
];

export default function HomePage() {
  const [desc, setDesc] = useState('');
  const [style, setStyle] = useState('cultural');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [error, setError] = useState('');
  const { token, setPreferences, setResearchData } = useTripContext();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const submit = async e => {
    e.preventDefault();
    if (!desc.trim()) return setError('Please describe your trip');
    setError(''); setLoading(true); setStage(1);
    try {
      setStage(1);
      const r1 = await axios.post(`${API}/ai/extract-intent`, { description: `${desc}. Travel style: ${style}` }, { headers });
      const prefs = { ...r1.data.preferences, travel_style: style };
      setPreferences(prefs);
      setStage(2);
      const r2 = await axios.post(`${API}/ai/research`, { preferences: prefs }, { headers });
      setResearchData(r2.data.research_data);
      setStage(4);
      navigate('/preferences');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      {loading && <LoadingScreen stage={stage} />}
      <div style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%)', color: 'white', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✈️ 🌍 🗺️</div>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>
            Plan Your Perfect Trip<br />
            <span style={{ color: '#a5f3fc' }}>with AI in Seconds</span>
          </h1>
          <p style={{ fontSize: 17, opacity: 0.9 }}>Describe your dream trip in plain English. TripGenie builds a complete, budget-optimized itinerary instantly.</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '-36px auto 60px', padding: '0 24px' }}>
        <div className="card" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.13)' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="label" style={{ fontSize: 15 }}>✍️ Describe your trip</label>
              <textarea className="textarea" style={{ fontSize: 15 }}
                placeholder='e.g. "7-day cultural trip to Japan for 2 people with a $4000 budget in July"'
                value={desc} onChange={e => setDesc(e.target.value)} />
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Include: destination · duration · travelers · budget · dates</p>
            </div>

            <div className="form-group">
              <label className="label">🎯 Travel Style</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {STYLES.map(s => (
                  <button key={s} type="button" onClick={() => setStyle(s)}
                    style={{ padding: '9px 18px', borderRadius: 10, border: `2px solid ${style === s ? '#4f46e5' : '#e2e8f0'}`, background: style === s ? '#eef2ff' : 'white', color: style === s ? '#4f46e5' : '#64748b', fontWeight: style === s ? 700 : 500, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
                    {ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !desc.trim()}>
              {loading ? 'Planning...' : '🚀 Plan My Trip'}
            </button>
          </form>

          <div style={{ marginTop: 22 }}>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>💡 Try an example:</p>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setDesc(ex)}
                style={{ display: 'block', width: '100%', textAlign: 'left', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 13px', marginBottom: 6, cursor: 'pointer', fontSize: 13, color: '#475569' }}
                onMouseEnter={e => e.target.style.background = '#eef2ff'}
                onMouseLeave={e => e.target.style.background = '#f8fafc'}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 32 }}>
          {[
            ['🧠', 'AI Intent Extraction', 'Understands your natural language description instantly'],
            ['🔍', 'Smart Research', 'Finds best flights, hotels and top activities for your destination'],
            ['📅', 'Conflict-Free Schedule', 'Builds a complete day-by-day itinerary automatically']
          ].map(([icon, title, desc]) => (
            <div key={title} className="card card-hover" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#64748b' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}