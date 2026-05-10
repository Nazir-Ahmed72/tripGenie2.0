import React from 'react';

const STAGES = [
  { id: 1, label: 'Understanding your trip description...', icon: '🧠' },
  { id: 2, label: 'Searching flights & hotels...', icon: '✈️' },
  { id: 3, label: 'Finding top activities...', icon: '🗺️' },
  { id: 4, label: 'Building your day-by-day plan...', icon: '📅' },
  { id: 5, label: 'Finalizing itinerary...', icon: '✨' },
];

export default function LoadingScreen({ stage = 1 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '44px 36px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Planning Your Trip</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 30 }}>AI agents are working...</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STAGES.map(s => {
            const active = s.id === stage;
            const done = s.id < stage;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 15px', borderRadius: 12, background: active ? '#eef2ff' : done ? '#f0fdf4' : '#f8fafc', border: active ? '2px solid #4f46e5' : '2px solid transparent' }}>
                <span style={{ fontSize: 18 }}>{done ? '✅' : active ? s.icon : '⏳'}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? '#4f46e5' : done ? '#166534' : '#94a3b8' }}>{s.label}</span>
                {active && <div className="spinner" style={{ marginLeft: 'auto', width: 18, height: 18, borderWidth: 3 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}