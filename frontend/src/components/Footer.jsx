import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#1A1A2E',
      color: '#9CA3AF',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '48px 48px 32px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: 48,
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#C9A84C" stroke="none" />
            </svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>TripGenie</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B7280', maxWidth: 260 }}>
            AI-powered travel itinerary builder. Describe your dream trip and get a complete, budget-optimized plan in seconds.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>
            Navigation
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Plan a Trip', to: '/' },
              { label: 'My Trips', to: '/dashboard' },
              { label: 'Sign In', to: '/login' },
              { label: 'Create Account', to: '/signup' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: 14,
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = '#FFFFFF'}
                onMouseLeave={e => e.target.style.color = '#9CA3AF'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 16 }}>
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <span style={{ color: '#9CA3AF' }}>support@tripgenie.ai</span>
            <span style={{ color: '#9CA3AF' }}>Available 9am - 6pm UTC</span>
            <span style={{ color: '#9CA3AF', marginTop: 4 }}>Made for travelers,<br />by travelers.</span>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div style={{
        borderTop: '1px solid #2D2D40',
        padding: '16px 48px',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <span style={{ fontSize: 13, color: '#4B5563' }}>
          {year} TripGenie. All rights reserved.
        </span>
        <span style={{ fontSize: 13, color: '#4B5563' }}>
          Privacy Policy &nbsp;&middot;&nbsp; Terms of Service
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 32px 24px 24px !important;
          }
          footer > div:last-child {
            padding: 16px 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
