import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

function SectionHeader({ title, count }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E' }}>{title}</h2>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#6B7280',
        background: '#F3F4F6',
        padding: '4px 10px',
        borderRadius: 999,
      }}>
        {count} {count === 1 ? 'result' : 'results'}
      </span>
    </div>
  );
}

function FlightCard({ flight }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '20px 20px',
      minWidth: 280,
      maxWidth: 280,
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'border-color 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#2E6DB4'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A2E', marginBottom: 4 }}>
        {flight.airline}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1B4F8A', marginBottom: 8, lineHeight: 1 }}>
        ${flight.price}
        <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', marginLeft: 4 }}>per person</span>
      </div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 3 }}>
        {flight.departure_code} &rarr; {flight.arrival_code}
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
        {flight.duration} &middot; {flight.stops} &middot; {flight.class}
      </div>
    </div>
  );
}

function HotelCard({ hotel }) {
  const stars = hotel.stars ? `${hotel.stars} stars` : '';
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '20px',
      minWidth: 280,
      maxWidth: 280,
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'border-color 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#2E6DB4'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1A2E', marginBottom: 4 }}>
        {hotel.name}
      </div>
      {stars && (
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{stars}</div>
      )}
      <div style={{ fontSize: 26, fontWeight: 700, color: '#1B4F8A', marginBottom: 8, lineHeight: 1 }}>
        ${hotel.price_per_night}
        <span style={{ fontSize: 13, fontWeight: 400, color: '#6B7280', marginLeft: 4 }}>/night</span>
      </div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
        {hotel.address}
      </div>
      {hotel.rating && (
        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
          {hotel.rating} rating &middot; {hotel.reviews} reviews
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '20px',
      minWidth: 260,
      maxWidth: 260,
      flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#2E6DB4'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
    >
      <div style={{ fontWeight: 600, fontSize: 15, color: '#1A1A2E', marginBottom: 8 }}>
        {activity.name}
      </div>
      {activity.category && (
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 500,
          background: '#F3F4F6',
          color: '#6B7280',
          marginBottom: 10,
          width: 'fit-content',
        }}>
          {activity.category}
        </span>
      )}
      {activity.description && (
        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>
          {activity.description}
        </p>
      )}
      <div style={{ fontSize: 12, color: '#9CA3AF', borderTop: '1px solid #F3F4F6', paddingTop: 10, marginTop: 'auto' }}>
        {activity.estimated_cost === 0
          ? 'Free'
          : activity.estimated_cost ? `$${activity.estimated_cost}` : ''}
        {activity.duration_hours ? ` \u00b7 ${activity.duration_hours}h` : ''}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const { researchData, preferences } = useTripContext();
  const navigate = useNavigate();

  if (!researchData) { navigate('/'); return null; }
  const { flights = [], hotels = [], activities = [] } = researchData;

  return (
    <div className="page">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 className="page-title">
            What we found for {preferences?.destination || 'your destination'}
          </h1>
          <p className="page-sub">
            Review available options below, then build your itinerary.
          </p>
        </div>

        {/* ─ Flights Section ─ */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Flights" count={flights.length} />
          {flights.length > 0 ? (
            <div className="hscroll-row">
              {flights.map((f, i) => <FlightCard key={i} flight={f} />)}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#9CA3AF', padding: '20px 0' }}>No flight data available.</p>
          )}
        </div>

        <hr className="divider" style={{ marginBottom: 48 }} />

        {/* ─ Hotels Section ─ */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Hotels" count={hotels.length} />
          {hotels.length > 0 ? (
            <div className="hscroll-row">
              {hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#9CA3AF', padding: '20px 0' }}>No hotel data available.</p>
          )}
        </div>

        <hr className="divider" style={{ marginBottom: 48 }} />

        {/* ─ Activities Section ─ */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Activities" count={activities.length} />
          {activities.length > 0 ? (
            <div className="hscroll-row">
              {activities.map((a, i) => <ActivityCard key={i} activity={a} />)}
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#9CA3AF', padding: '20px 0' }}>No activities found.</p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/preferences')}>
            Back
          </button>
          <button
            id="view-itinerary-btn"
            className="btn btn-primary"
            style={{ flex: 1, height: 46 }}
            onClick={() => navigate('/itinerary')}
          >
            Build My Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}