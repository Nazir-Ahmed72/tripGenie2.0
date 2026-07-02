import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';
import LoadingScreen from '../components/LoadingScreen';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TRAVEL_STYLES = [
  { value: 'cultural',  label: 'Cultural'  },
  { value: 'adventure', label: 'Adventure' },
  { value: 'relaxed',   label: 'Relaxed'   },
  { value: 'family',    label: 'Family'    },
];

const MAX_BUDGET = 20000;

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
    setForm(f => ({
      ...f,
      [name]: (name === 'num_travelers' || name === 'budget') ? Number(value) : value,
    }));
  };

  const setTravelers = delta => {
    setForm(f => ({
      ...f,
      num_travelers: Math.max(1, Math.min(20, (f.num_travelers || 1) + delta)),
    }));
  };

  const setStyle = value => {
    setForm(f => ({ ...f, travel_style: value }));
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPreferences(form);
    try {
      const res = await axios.post(
        `${API}/ai/plan`,
        { preferences: form, research_data: researchData },
        { headers }
      );
      setItinerary(res.data.itinerary);
      navigate('/research');
    } catch (err) {
      setError(err.response?.data?.message || 'Planning failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const budget = form.budget || 0;
  const budgetPct = Math.min(100, Math.round((budget / MAX_BUDGET) * 100));

  return (
    <>
      {loading && <LoadingScreen stage={4} />}

      <div className="page">
        <div className="container" style={{ maxWidth: 600 }}>
          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <h1 className="page-title">Confirm your trip details</h1>
            <p className="page-sub">
              Review and adjust the details we extracted from your description.
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            {/* ─ Destination ─ */}
            <div className="form-group">
              <label className="label" htmlFor="pref-destination">Destination</label>
              <input
                id="pref-destination"
                name="destination"
                className="input"
                placeholder="e.g. Tokyo, Japan"
                value={form.destination || ''}
                onChange={handle}
                required
              />
            </div>

            <hr className="divider" />

            {/* ─ Departure City ─ */}
            <div className="form-group">
              <label className="label" htmlFor="pref-origin">Departure City</label>
              <input
                id="pref-origin"
                name="origin"
                className="input"
                placeholder="e.g. New York, NY"
                value={form.origin || ''}
                onChange={handle}
              />
            </div>

            <hr className="divider" />

            {/* ─ Travel Dates ─ */}
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label className="label" htmlFor="pref-departure">Departure</label>
                <input
                  id="pref-departure"
                  name="departure_date"
                  type="date"
                  className="input"
                  value={form.departure_date || ''}
                  onChange={handle}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="pref-return">Return</label>
                <input
                  id="pref-return"
                  name="return_date"
                  type="date"
                  className="input"
                  value={form.return_date || ''}
                  onChange={handle}
                  required
                />
              </div>
            </div>

            <hr className="divider" />

            {/* ─ Budget ─ */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <label className="label" style={{ marginBottom: 0 }}>Budget</label>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1B4F8A' }}>
                  ${(budget).toLocaleString()}
                </span>
              </div>
              <input
                id="pref-budget"
                name="budget"
                type="range"
                className="range-slider"
                min="100"
                max={MAX_BUDGET}
                step="50"
                value={budget || 100}
                onChange={handle}
                style={{ '--range-pct': `${budgetPct}%` }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#9CA3AF' }}>
                <span>$100</span>
                <span>${MAX_BUDGET.toLocaleString()}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* ─ Travelers ─ */}
            <div className="form-group">
              <label className="label">Travelers</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="stepper">
                  <button
                    type="button"
                    id="travelers-minus"
                    className="stepper-btn"
                    onClick={() => setTravelers(-1)}
                    disabled={(form.num_travelers || 1) <= 1}
                  >
                    &minus;
                  </button>
                  <div className="stepper-value">{form.num_travelers || 1}</div>
                  <button
                    type="button"
                    id="travelers-plus"
                    className="stepper-btn"
                    onClick={() => setTravelers(1)}
                    disabled={(form.num_travelers || 1) >= 20}
                  >
                    &#43;
                  </button>
                </div>
                <span style={{ fontSize: 14, color: '#6B7280' }}>
                  {(form.num_travelers || 1) === 1 ? '1 person' : `${form.num_travelers} people`}
                </span>
              </div>
            </div>

            <hr className="divider" />

            {/* ─ Travel Style ─ */}
            <div className="form-group">
              <label className="label">Travel Style</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
              }}>
                {TRAVEL_STYLES.map(ts => (
                  <div
                    key={ts.value}
                    id={`style-card-${ts.value}`}
                    className={`radio-card${form.travel_style === ts.value ? ' selected' : ''}`}
                    onClick={() => setStyle(ts.value)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setStyle(ts.value)}
                  >
                    {ts.label}
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider" />

            {/* ─ Actions ─ */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/')}
                style={{ flexShrink: 0 }}
              >
                Back
              </button>
              <button
                id="confirm-preferences-btn"
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, height: 46 }}
                disabled={loading}
              >
                {loading ? 'Building itinerary...' : 'Confirm and Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .radio-cards-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}