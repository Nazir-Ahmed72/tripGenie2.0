import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import PreferencesPage from './pages/PreferencesPage';
import ResearchPage from './pages/ResearchPage';
import ItineraryPage from './pages/ItineraryPage';
import DashboardPage from './pages/DashboardPage';
import './styles/global.css';

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<><Navbar /><ProtectedRoute><HomePage /></ProtectedRoute></>} />
          <Route path="/preferences" element={<><Navbar /><ProtectedRoute><PreferencesPage /></ProtectedRoute></>} />
          <Route path="/research" element={<><Navbar /><ProtectedRoute><ResearchPage /></ProtectedRoute></>} />
          <Route path="/itinerary" element={<><Navbar /><ProtectedRoute><ItineraryPage /></ProtectedRoute></>} />
          <Route path="/dashboard" element={<><Navbar /><ProtectedRoute><DashboardPage /></ProtectedRoute></>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TripProvider>
  );
}