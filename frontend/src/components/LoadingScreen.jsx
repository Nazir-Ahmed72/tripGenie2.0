import React from 'react';

const STAGES = [
  { id: 1, label: 'Understanding your trip description' },
  { id: 2, label: 'Searching flights and hotels' },
  { id: 3, label: 'Finding top activities' },
  { id: 4, label: 'Building your day-by-day plan' },
  { id: 5, label: 'Finalizing itinerary' },
];

const STAGE_DESCRIPTIONS = {
  1: 'Analyzing your travel preferences and extracting key details.',
  2: 'Scanning available flights and accommodations for your dates.',
  3: 'Curating the best activities and experiences at your destination.',
  4: 'Arranging activities into a conflict-free daily schedule.',
  5: 'Applying final optimizations to fit your budget.',
};

const EST_TIME = {
  1: 'About 30 seconds remaining',
  2: 'About 25 seconds remaining',
  3: 'About 20 seconds remaining',
  4: 'About 10 seconds remaining',
  5: 'Almost done',
};

export default function LoadingScreen({ stage = 1 }) {
  const progressPct = Math.round(((stage - 1) / (STAGES.length - 1)) * 100);
  const clampedStage = Math.min(Math.max(stage, 1), STAGES.length);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(26, 26, 46, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        padding: '40px 36px',
        width: '100%',
        maxWidth: 480,
        margin: '0 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#C9A84C" stroke="none" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1B4F8A' }}>TripGenie</span>
        </div>

        {/* Heading */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>
          Building your itinerary
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
          {STAGE_DESCRIPTIONS[clampedStage]}
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          {STAGES.map((s, idx) => {
            const done   = s.id < clampedStage;
            const active = s.id === clampedStage;
            const stepPct = `${(idx / (STAGES.length - 1)) * 100}%`;

            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: idx < STAGES.length - 1 ? 1 : 0 }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: done ? '#16A34A' : active ? '#1B4F8A' : '#E5E7EB',
                  border: active ? '2px solid #1B4F8A' : 'none',
                  boxShadow: active ? '0 0 0 3px rgba(27,79,138,0.15)' : 'none',
                  animation: active ? 'pulse-dot 1.4s ease-in-out infinite' : 'none',
                  flexShrink: 0,
                }} />
                {idx < STAGES.length - 1 && (
                  <div style={{ width: '100%', height: 1, background: done ? '#16A34A' : '#E5E7EB', marginTop: -9, zIndex: -1, marginLeft: 12, marginRight: -12 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step label */}
        <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>
          Step {clampedStage} of {STAGES.length} — {STAGES[clampedStage - 1]?.label}
        </p>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>
          {EST_TIME[clampedStage]}
        </p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}