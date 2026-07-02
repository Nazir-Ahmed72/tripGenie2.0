import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import PreferencesPage from './pages/PreferencesPage';
import ResearchPage from './pages/ResearchPage';
import ItineraryPage from './pages/ItineraryPage';
import DashboardPage from './pages/DashboardPage';
import './styles/global.css';

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<AppLayout><ProtectedRoute><HomePage /></ProtectedRoute></AppLayout>} />
          <Route path="/preferences" element={<AppLayout><ProtectedRoute><PreferencesPage /></ProtectedRoute></AppLayout>} />
          <Route path="/research" element={<AppLayout><ProtectedRoute><ResearchPage /></ProtectedRoute></AppLayout>} />
          <Route path="/itinerary" element={<AppLayout><ProtectedRoute><ItineraryPage /></ProtectedRoute></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><ProtectedRoute><DashboardPage /></ProtectedRoute></AppLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TripProvider>
  );
}