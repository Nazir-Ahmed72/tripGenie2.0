import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

const CompassIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#C9A84C" stroke="none" />
  </svg>
);

export default function Navbar() {
  const { user, logout } = useTripContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 64,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 48px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <CompassIcon />
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1B4F8A', letterSpacing: '-0.3px' }}>
            TripGenie
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-desktop">
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#6B7280',
                  padding: '8px 12px',
                  borderRadius: 6,
                  transition: 'color 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.target.style.color = '#1A1A2E'}
                onMouseLeave={e => e.target.style.color = '#6B7280'}
              >
                My Trips
              </Link>

              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#1B4F8A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A2E' }}>
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  marginLeft: 4,
                  padding: '7px 14px',
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = '#F8F9FA'; e.target.style.borderColor = '#D1D5DB'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#E5E7EB'; }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '7px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#6B7280',
                  borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: '#6B7280',
          }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: '12px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #E5E7EB', marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1B4F8A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
              </div>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding: '10px 0', fontSize: 15, color: '#1A1A2E', textDecoration: 'none' }}>My Trips</Link>
              <button onClick={handleLogout} style={{ padding: '10px 0', fontSize: 15, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ padding: '10px 0', fontSize: 15, color: '#1A1A2E', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ padding: '10px 0', fontSize: 15, color: '#1B4F8A', fontWeight: 600, textDecoration: 'none' }}>Get Started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}