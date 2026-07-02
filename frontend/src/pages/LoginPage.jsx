import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80';
const QUOTE = '"Travel is the only thing you buy that makes you richer."';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useTripContext();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left — Hero image */}
      <div style={{
        flex: '0 0 50%',
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '48px',
      }} className="auth-hero">
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.50)',
        }} />
        {/* Quote */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.5,
            fontStyle: 'italic',
            maxWidth: 380,
            marginBottom: 12,
          }}>
            {QUOTE}
          </p>
          <div style={{ width: 40, height: 2, background: '#C9A84C' }} />
        </div>
      </div>

      {/* Right — Form panel */}
      <div style={{
        flex: 1,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 64px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#C9A84C" stroke="none" />
          </svg>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1B4F8A' }}>TripGenie</span>
        </div>

        {/* Heading */}
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 32 }}>
            Sign in to your account to continue planning.
          </p>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: '#2E6DB4', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                className="input"
                placeholder="Your password"
                value={form.password}
                onChange={handle}
                required
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: 8, height: 44, fontSize: 15 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2E6DB4', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-hero { display: none !important; }
        }
      `}</style>
    </div>
  );
}