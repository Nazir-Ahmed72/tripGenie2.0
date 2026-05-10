import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTripContext } from '../context/TripContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="page-title">My Trips 🧳</h1>
            <p className="page-sub">Welcome back, {user?.name}!</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>+ Plan New Trip</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner" style={{ margin: '0 auto 14px' }} />
            <p style={{ color: '#64748b' }}>Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>✈️</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No trips yet</h2>
            <p style={{ color: '#64748b', marginBottom: 22 }}>Plan your first AI-powered trip!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>🚀 Plan a Trip</button>
          </div>
        ) : (
          <div className="grid-2">
            {trips.map(trip => (
              <div key={trip._id} className="card card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 32 }}>🌍</span>
                  <span className="badge badge-primary">{trip.travelStyle}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{trip.title}</h3>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>
                  📅 {trip.departureDate} → {trip.returnDate}
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>
                  👥 {trip.numTravelers} travelers · 💰 ${trip.budget}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
                  Saved {new Date(trip.createdAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => view(trip)}>View Itinerary</button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(trip._id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}