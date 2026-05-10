import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Bar({ label, amount, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ fontWeight: 700 }}>${(amount || 0).toFixed(0)}</span>
      </div>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
        <div style={{ height: 8, width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { itinerary, preferences, researchData, token } = useTripContext();
  const [openDay, setOpenDay] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  if (!itinerary) { navigate('/'); return null; }

  const { daily_schedule = [], cost_breakdown = {}, selected_flight, selected_hotel, within_budget } = itinerary;
  const slotColor = { morning: '#f59e0b', afternoon: '#4f46e5', evening: '#8b5cf6' };
  const slotIcon = { morning: '🌅', afternoon: '☀️', evening: '🌙' };

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/trips`, {
        title: `Trip to ${itinerary.destination}`,
        destination: itinerary.destination,
        preferences,
        researchData,
        itinerary
      }, { headers });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Your Itinerary 📅</h1>
            <p className="page-sub">{itinerary.num_days}-day {itinerary.travel_style} trip to {itinerary.destination} · {itinerary.num_travelers} traveler(s)</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {saved
              ? <span className="badge badge-success" style={{ padding: '10px 18px', fontSize: 14 }}>✅ Saved!</span>
              : <button className="btn btn-outline" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save Trip'}</button>}
            <button className="btn btn-ghost" onClick={() => navigate('/')}>+ New Trip</button>
          </div>
        </div>

        <div className={`alert ${within_budget ? 'alert-success' : 'alert-warning'}`}>
          {within_budget
            ? `✅ Within budget! Estimated: $${cost_breakdown.total?.toFixed(0)} of $${itinerary.budget}`
            : `⚠️ Slightly over budget: $${cost_breakdown.total?.toFixed(0)} vs $${itinerary.budget}`}
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>📋 Day-by-Day Plan</h2>

            {selected_flight && (
              <div className="card" style={{ marginBottom: 12, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                <div style={{ fontWeight: 700, color: '#4f46e5', fontSize: 13, marginBottom: 6 }}>✈️ Selected Flight</div>
                <div style={{ fontSize: 14 }}>{selected_flight.airline} · {selected_flight.departure_code} → {selected_flight.arrival_code}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>${selected_flight.price}/person · {selected_flight.stops}</div>
              </div>
            )}

            {selected_hotel && (
              <div className="card" style={{ marginBottom: 16, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, color: '#166534', fontSize: 13, marginBottom: 6 }}>🏨 Selected Hotel</div>
                <div style={{ fontSize: 14 }}>{selected_hotel.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>${selected_hotel.price_per_night}/night</div>
              </div>
            )}

            {daily_schedule.map(day => (
              <div key={day.day} className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Day {day.day} — {day.date}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{day.summary}</div>
                  </div>
                  <span style={{ fontSize: 18, marginLeft: 12 }}>{openDay === day.day ? '▲' : '▼'}</span>
                </button>

                {openDay === day.day && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['morning', 'afternoon', 'evening'].map(slot => {
                      const act = day.slots[slot];
                      return (
                        <div key={slot} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, borderLeft: `4px solid ${slotColor[slot]}` }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: slotColor[slot], marginBottom: 4 }}>
                            {slotIcon[slot]} {slot.toUpperCase()} · {act?.time || '—'}
                          </div>
                          {act ? (
                            <>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{act.name}</div>
                              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                                📍 {act.address}{act.estimated_cost > 0 ? ` · $${act.estimated_cost}` : ' · Free'}
                              </div>
                            </>
                          ) : <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>Free time</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', top: 76 }}>
            <h2 style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>💰 Cost Breakdown</h2>
            <div className="card">
              <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#4f46e5' }}>${cost_breakdown.total?.toFixed(0)}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Total · Budget: ${itinerary.budget}</div>
              </div>
              <Bar label="✈️ Flights" amount={cost_breakdown.flights} total={cost_breakdown.total} color="#4f46e5" />
              <Bar label="🏨 Hotel" amount={cost_breakdown.accommodation} total={cost_breakdown.total} color="#06b6d4" />
              <Bar label="🗺️ Activities" amount={cost_breakdown.activities} total={cost_breakdown.total} color="#10b981" />
              <Bar label="📦 Misc" amount={cost_breakdown.miscellaneous} total={cost_breakdown.total} color="#f59e0b" />
            </div>

            <div className="card" style={{ marginTop: 14, background: '#f8fafc' }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📋 Summary</h3>
              {[
                ['Destination', itinerary.destination],
                ['Duration', `${itinerary.num_days} days`],
                ['Travelers', itinerary.num_travelers],
                ['Style', itinerary.travel_style],
                ['Dates', `${itinerary.departure_date} → ${itinerary.return_date}`]
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}