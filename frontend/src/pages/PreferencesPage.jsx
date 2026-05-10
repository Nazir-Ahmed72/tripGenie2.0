import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';
import LoadingScreen from '../components/LoadingScreen';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function PreferencesPage() {
  const { preferences, setPreferences, researchData, setItinerary, token } = useTripContext();
  const [form, setForm] = useState(preferences || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  if (!preferences) { navigate('/'); return null; }

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: (name === 'num_travelers' || name === 'budget') ? Number(value) : value }));
  };

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    setPreferences(form);
    try {
      const res = await axios.post(`${API}/ai/plan`, { preferences: form, research_data: researchData }, { headers });
      setItinerary(res.data.itinerary);
      navigate('/research');
    } catch (err) {
      setError(err.response?.data?.message || 'Planning failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      {loading && <LoadingScreen stage={4} />}
      <div className="page">
        <div className="container" style={{ maxWidth: 580 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 className="page-title">Confirm Preferences ✅</h1>
            <p className="page-sub">Review what our AI extracted. Edit anything that looks wrong.</p>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="card">
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="label">🌍 Destination</label>
                <input name="destination" className="input" value={form.destination || ''} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="label">🛫 Departure City</label>
                <input name="origin" className="input" value={form.origin || ''} onChange={handle} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">📅 Departure</label>
                  <input name="departure_date" type="date" className="input" value={form.departure_date || ''} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label className="label">📅 Return</label>
                  <input name="return_date" type="date" className="input" value={form.return_date || ''} onChange={handle} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">👥 Travelers</label>
                  <input name="num_travelers" type="number" className="input" value={form.num_travelers || 1} onChange={handle} min="1" max="20" required />
                </div>
                <div className="form-group">
                  <label className="label">💰 Budget (USD)</label>
                  <input name="budget" type="number" className="input" value={form.budget || ''} onChange={handle} min="100" required />
                </div>
              </div>
              <div className="form-group">
                <label className="label">🎯 Travel Style</label>
                <select name="travel_style" className="select" value={form.travel_style || 'cultural'} onChange={handle}>
                  <option value="cultural">🏛️ Cultural</option>
                  <option value="adventure">🏔️ Adventure</option>
                  <option value="relaxed">🏖️ Relaxed</option>
                  <option value="family">👨‍👩‍👧‍👦 Family</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Building...' : '✅ Confirm & Build Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}