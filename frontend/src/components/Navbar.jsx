import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

export default function Navbar() {
  const { user, logout } = useTripContext();
  const navigate = useNavigate();

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✈️</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Trip<span style={{ color: '#4f46e5' }}>Genie</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">My Trips</Link>
              <span style={{ fontSize: 14, color: '#64748b' }}>Hi, <b>{user.name}</b></span>
              <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}