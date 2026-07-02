import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SLOT_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CostBar({ label, amount, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((amount / total) * 100)) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: '#6B7280' }}>{label}</span>
        <span style={{ fontWeight: 600, color: '#1A1A2E' }}>${(amount || 0).toFixed(0)}</span>
      </div>
      <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2 }}>
        <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s' }} />
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

  const total = cost_breakdown.total || 0;
  const budget = itinerary.budget || 0;
  const budgetUsedPct = budget > 0 ? Math.min(100, Math.round((total / budget) * 100)) : 0;
  const withinBudget = within_budget !== undefined ? within_budget : total <= budget;

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/trips`, {
        title: `Trip to ${itinerary.destination}`,
        destination: itinerary.destination,
        preferences,
        researchData,
        itinerary,
      }, { headers });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      {/* ─ Sticky bar ─ */}
      <div className="sticky-bar">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E' }}>
                {itinerary.destination}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                {itinerary.num_days} days &middot; {itinerary.num_travelers} traveler{itinerary.num_travelers !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, minWidth: 200 }}>
              <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Estimated:</span>
                <span style={{ fontWeight: 700, color: withinBudget ? '#16A34A' : '#DC2626' }}>
                  ${total.toFixed(0)}
                </span>
                <span style={{ color: '#9CA3AF' }}>of</span>
                <span style={{ fontWeight: 600, color: '#1A1A2E' }}>${budget}</span>
              </div>
              <div style={{ width: '100%' }}>
                <div className="progress-track" style={{ height: 4 }}>
                  <div
                    className={`progress-fill${withinBudget ? ' success' : ' danger'}`}
                    style={{ width: `${budgetUsedPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Trip info row */}
          <div style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 28,
            paddingBottom: 24,
            borderBottom: '1px solid #E5E7EB',
          }}>
            {[
              ['Destination', itinerary.destination],
              ['Dates', `${itinerary.departure_date} — ${itinerary.return_date}`],
              ['Duration', `${itinerary.num_days} days`],
              ['Travelers', itinerary.num_travelers],
              ['Style', itinerary.travel_style],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{v}</div>
              </div>
            ))}

            {/* Actions pushed right */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              {saved ? (
                <span style={{
                  padding: '8px 16px',
                  background: '#F0FDF4',
                  color: '#16A34A',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid #BBF7D0',
                }}>
                  Trip Saved
                </span>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Trip'}
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
                New Trip
              </button>
            </div>
          </div>

          {/* Selected flight & hotel summary */}
          {(selected_flight || selected_hotel) && (
            <div className="grid-2" style={{ marginBottom: 28, gap: 16 }}>
              {selected_flight && (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderLeft: '3px solid #1B4F8A',
                  borderRadius: 8,
                  padding: '16px 20px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#1B4F8A', marginBottom: 6 }}>Selected Flight</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{selected_flight.airline}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {selected_flight.departure_code} &rarr; {selected_flight.arrival_code} &middot; ${selected_flight.price}/person
                  </div>
                </div>
              )}
              {selected_hotel && (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderLeft: '3px solid #16A34A',
                  borderRadius: 8,
                  padding: '16px 20px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16A34A', marginBottom: 6 }}>Selected Hotel</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{selected_hotel.name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    ${selected_hotel.price_per_night}/night
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid-2" style={{ alignItems: 'start', gap: 32 }}>
            {/* ─ Day cards ─ */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                Day-by-Day Schedule
              </h2>

              {daily_schedule.map(day => (
                <div
                  key={day.day}
                  className="card"
                  style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}
                >
                  {/* Card header */}
                  <button
                    onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '18px 20px',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E' }}>
                        Day {day.day}
                        {day.date && (
                          <span style={{ fontWeight: 400, color: '#6B7280', marginLeft: 8, fontSize: 13 }}>
                            {day.date}
                          </span>
                        )}
                      </div>
                      {day.summary && (
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{day.summary}</div>
                      )}
                    </div>
                    <ChevronIcon open={openDay === day.day} />
                  </button>

                  {/* Expanded content */}
                  {openDay === day.day && (
                    <div style={{ borderTop: '1px solid #E5E7EB' }}>
                      {['morning', 'afternoon', 'evening'].map((slot, si) => {
                        const act = day.slots?.[slot];
                        return (
                          <div
                            key={slot}
                            style={{
                              display: 'flex',
                              gap: 16,
                              padding: '14px 20px',
                              borderBottom: si < 2 ? '1px solid #F3F4F6' : 'none',
                              alignItems: 'flex-start',
                            }}
                          >
                            {/* Time label */}
                            <div style={{ minWidth: 80, flexShrink: 0 }}>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: '#9CA3AF',
                              }}>
                                {SLOT_LABELS[slot]}
                              </span>
                              {act?.time && (
                                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{act.time}</div>
                              )}
                            </div>

                            {/* Activity */}
                            <div style={{ flex: 1 }}>
                              {act ? (
                                <>
                                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{act.name}</div>
                                  {act.address && (
                                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>{act.address}</div>
                                  )}
                                </>
                              ) : (
                                <span style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>Free time</span>
                              )}
                            </div>

                            {/* Cost */}
                            {act && act.estimated_cost > 0 && (
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#1B4F8A', flexShrink: 0 }}>
                                ${act.estimated_cost}
                              </div>
                            )}
                            {act && act.estimated_cost === 0 && (
                              <div style={{ fontSize: 12, color: '#16A34A', flexShrink: 0 }}>Free</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ─ Cost breakdown sidebar ─ */}
            <div style={{ position: 'sticky', top: 120 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                Cost Breakdown
              </h2>
              <div className="card">
                {/* Total */}
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: '#F8F9FA',
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  marginBottom: 24,
                }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1B4F8A', lineHeight: 1 }}>
                    ${total.toFixed(0)}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>
                    Estimated Total &middot; Budget: ${budget}
                  </div>
                  <div style={{
                    marginTop: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    color: withinBudget ? '#16A34A' : '#DC2626',
                  }}>
                    {withinBudget ? 'Within budget' : 'Over budget'}
                  </div>
                </div>

                <CostBar label="Flights"       amount={cost_breakdown.flights}       total={total} color="#1B4F8A" />
                <CostBar label="Accommodation" amount={cost_breakdown.accommodation}  total={total} color="#2E6DB4" />
                <CostBar label="Activities"    amount={cost_breakdown.activities}     total={total} color="#16A34A" />
                <CostBar label="Food"          amount={cost_breakdown.food}           total={total} color="#C9A84C" />
                <CostBar label="Miscellaneous" amount={cost_breakdown.miscellaneous}  total={total} color="#6B7280" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}