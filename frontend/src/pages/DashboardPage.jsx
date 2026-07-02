import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STYLE_BADGE_CLASS = {
  cultural:  'badge badge-cultural',
  adventure: 'badge badge-adventure',
  relaxed:   'badge badge-relaxed',
  family:    'badge badge-family',
};

function TripCard({ trip, onView, onDelete }) {
  const style = trip.travelStyle?.toLowerCase() || '';
  const badgeClass = STYLE_BADGE_CLASS[style] || 'badge badge-primary';

  return (
    <div
      className="card card-hover"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.3, flex: 1 }}>
          {trip.title || trip.destination}
        </h3>
        <span className={badgeClass} style={{ marginLeft: 10, flexShrink: 0 }}>
          {trip.travelStyle || style}
        </span>
      </div>

      {/* Meta */}
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>
        {trip.departureDate && trip.returnDate
          ? `${trip.departureDate} — ${trip.returnDate}`
          : 'Dates not available'}
      </div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
        {trip.numTravelers ? `${trip.numTravelers} traveler${trip.numTravelers !== 1 ? 's' : ''}` : ''}
        {trip.numTravelers && trip.budget ? ' \u00b7 ' : ''}
        {trip.budget ? `$${trip.budget} budget` : ''}
      </div>

      {/* Estimated cost */}
      {trip.itinerary?.cost_breakdown?.total && (
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1B4F8A', marginBottom: 12 }}>
          ${Math.round(trip.itinerary.cost_breakdown.total).toLocaleString()}
          <span style={{ fontSize: 12, fontWeight: 400, color: '#6B7280', marginLeft: 4 }}>estimated</span>
        </div>
      )}

      {/* Saved date */}
      <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
        Saved {new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="text-link"
          style={{ fontWeight: 600 }}
          onClick={() => onView(trip)}
        >
          View Itinerary &rarr;
        </button>
        <button
          onClick={() => onDelete(trip._id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            color: '#9CA3AF',
            borderRadius: 4,
            fontSize: 13,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = '#DC2626'}
          onMouseLeave={e => e.target.style.color = '#9CA3AF'}
          title="Delete trip"
          aria-label="Delete trip"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token, setPreferences, setResearchData, setItinerary } = useTripContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/trips`, { headers })
      .then(r => setTrips(r.data.trips))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const view = trip => {
    setPreferences(trip.preferences);
    setResearchData(trip.researchData);
    setItinerary(trip.itinerary);
    navigate('/itinerary');
  };

  const del = async id => {
    if (!window.confirm('Delete this trip?')) return;
    await axios.delete(`${API}/trips/${id}`, { headers });
    setTrips(trips.filter(t => t._id !== id));
  };

  return (
    <div className="page">
      <div className="container">
        {/* Page header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h1 className="page-title">My Trips</h1>
            {user?.name && (
              <p className="page-sub">Welcome back, {user.name}.</p>
            )}
          </div>
          <button
            id="new-trip-btn"
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            New Trip
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 14, color: '#6B7280' }}>Loading your trips...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && trips.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#FFFFFF',
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>
              You haven't planned any trips yet
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 28 }}>
              Describe your ideal trip and we'll build a complete itinerary for you.
            </p>
            <button
              id="start-planning-btn"
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Start Planning
            </button>
          </div>
        )}

        {/* Trip grid */}
        {!loading && trips.length > 0 && (
          <>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }} className="dashboard-grid">
              {trips.map(trip => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onView={view}
                  onDelete={del}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .dashboard-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}