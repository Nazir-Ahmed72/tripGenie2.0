import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useTripContext();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/signup`, { name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#06b6d4,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px' }}>🌍</div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Start planning with AI</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input name="name" className="input" placeholder="Your name" value={form.name} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input name="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input name="password" type="password" className="input" placeholder="Min 6 characters" value={form.password} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input name="confirm" type="password" className="input" placeholder="Repeat password" value={form.confirm} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}