import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';
import LoadingScreen from '../components/LoadingScreen';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STYLES = ['Adventure', 'Cultural', 'Relaxed', 'Family'];
const STYLE_VALUES = { Adventure: 'adventure', Cultural: 'cultural', Relaxed: 'relaxed', Family: 'family' };

const HERO_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80';

const STATS = [
  { number: '10,000+', label: 'Destinations' },
  { number: '50,000+', label: 'Trips Planned' },
  { number: '4.9', label: 'Star Rating' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Describe Your Trip',
    desc: 'Tell us your destination, travel dates, number of travelers, budget, and the kind of experience you are looking for.',
  },
  {
    step: '02',
    title: 'We Research Everything',
    desc: 'Our AI scans flights, hotels, and activities to find the best options that match your preferences and budget.',
  },
  {
    step: '03',
    title: 'Get Your Itinerary',
    desc: 'Receive a complete, day-by-day itinerary with morning, afternoon, and evening plans — ready to use.',
  },
];

export default function HomePage() {
  const [desc, setDesc] = useState('');
  const [style, setStyle] = useState('Cultural');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [error, setError] = useState('');
  const { token, setPreferences, setResearchData } = useTripContext();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const submit = async e => {
    e.preventDefault();
    if (!desc.trim()) return setError('Please describe your trip first.');
    setError('');
    setLoading(true);
    setStage(1);
    try {
      setStage(1);
      const r1 = await axios.post(
        `${API}/ai/extract-intent`,
        { description: `${desc}. Travel style: ${STYLE_VALUES[style]}` },
        { headers }
      );
      const prefs = { ...r1.data.preferences, travel_style: STYLE_VALUES[style] };
      setPreferences(prefs);
      setStage(2);
      const r2 = await axios.post(`${API}/ai/research`, { preferences: prefs }, { headers });
      setResearchData(r2.data.research_data);
      setStage(4);
      navigate('/preferences');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen stage={stage} />}

      {/* ─── Hero ─────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: 560,
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

        {/* Hero text */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: 720,
        }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: '-0.5px',
          }}>
            Plan your perfect trip<br />in seconds
          </h1>
          <p style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            maxWidth: 500,
            margin: '0 auto',
          }}>
            Describe your trip and our AI builds your complete itinerary.
          </p>
        </div>

        {/* Trip Input Card — overlaps hero bottom */}
        <div style={{
          position: 'absolute',
          bottom: -120,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 700,
          padding: '0 24px',
          zIndex: 2,
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 8,
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            border: '1px solid #E5E7EB',
          }}>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <textarea
                  id="trip-description"
                  className="textarea"
                  placeholder='Describe your dream trip. For example: 7 day cultural trip to Japan for 2 people with a budget of $3000 in April.'
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  style={{ height: 100, resize: 'none' }}
                />
              </div>

              {/* Style chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {STYLES.map(s => (
                  <button
                    key={s}
                    type="button"
                    id={`style-chip-${s.toLowerCase()}`}
                    className={`style-chip${style === s ? ' selected' : ''}`}
                    onClick={() => setStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                id="plan-trip-btn"
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || !desc.trim()}
                style={{ height: 46, fontSize: 15, fontWeight: 600 }}
              >
                {loading ? 'Planning...' : 'Plan My Trip'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer for card overlap */}
      <div style={{ height: 148 }} />

      {/* ─── Stats Row ─────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            padding: '40px 0',
          }}>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  textAlign: 'center',
                  padding: '0 24px',
                  borderRight: i < STATS.length - 1 ? '1px solid #E5E7EB' : 'none',
                }}
              >
                <div style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#1B4F8A',
                  letterSpacing: '-0.5px',
                  marginBottom: 6,
                }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── How It Works ──────────────────────────────── */}
      <div style={{ padding: '80px 0', background: '#F8F9FA' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: 12,
            }}>
              How It Works
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1A1A2E', letterSpacing: '-0.3px' }}>
              Your itinerary in three steps
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ position: 'relative' }}>
                {/* Step number */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#1B4F8A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 20,
                }}>
                  {step.step}
                </div>

                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 24,
                    left: 'calc(48px + 16px)',
                    right: -32,
                    height: 1,
                    background: '#E5E7EB',
                  }} />
                )}

                <h3 style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: '#1A1A2E',
                  marginBottom: 10,
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .home-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}