import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

export default function ResearchPage() {
  const { researchData, preferences } = useTripContext();
  const [tab, setTab] = useState('flights');
  const navigate = useNavigate();

  if (!researchData) { navigate('/'); return null; }
  const { flights = [], hotels = [], activities = [] } = researchData;

  const Tab = ({ id, label, count }) => (
    <button onClick={() => setTab(id)} style={{ padding: '9px 20px', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', background: tab === id ? '#4f46e5' : 'transparent', color: tab === id ? 'white' : '#64748b', transition: 'all 0.2s' }}>
      {label} ({count})
    </button>
  );

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Research Results 🔍</h1>
          <p className="page-sub">Found options for <strong>{preferences?.destination}</strong></p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 14, marginBottom: 26, width: 'fit-content' }}>
          <Tab id="flights" label="✈️ Flights" count={flights.length} />
          <Tab id="hotels" label="🏨 Hotels" count={hotels.length} />
          <Tab id="activities" label="🗺️ Activities" count={activities.length} />
        </div>

        {tab === 'flights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {flights.map((f, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 3 }}>{f.airline_logo} {f.airline}</div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>{f.departure_code} → {f.arrival_code} · {f.duration}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 3 }}>{f.stops} · {f.seats_left} seats left · {f.class}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#4f46e5' }}>${f.price}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>per person</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'hotels' && (
          <div className="grid-3">
            {hotels.map((h, i) => (
              <div key={i} className="card card-hover">
                <div style={{ fontSize: 36, marginBottom: 10 }}>{h.image}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{h.name}</h3>
                <div style={{ color: '#f59e0b', marginBottom: 4 }}>{'⭐'.repeat(h.stars)}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>{h.address}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>⭐ {h.rating} ({h.reviews} reviews)</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: '#4f46e5' }}>
                  ${h.price_per_night}<span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>/night</span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {h.amenities.map(a => <span key={a} className="badge badge-primary" style={{ fontSize: 11 }}>{a}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'activities' && (
          <div className="grid-3">
            {activities.map((a, i) => (
              <div key={i} className="card card-hover">
                <div style={{ fontSize: 30, marginBottom: 8 }}>{a.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.name}</h3>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>{a.description}</div>
                <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>📍 {a.address}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#f59e0b', fontSize: 13 }}>⭐ {a.rating} ({a.reviews})</span>
                  <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: 14 }}>{a.estimated_cost === 0 ? 'Free' : `$${a.estimated_cost}`}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>⏱ {a.duration_hours}h · 🕐 Best: {a.best_time}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/preferences')}>← Back</button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => navigate('/itinerary')}>
            View My Itinerary →
          </button>
        </div>
      </div>
    </div>
  );
}