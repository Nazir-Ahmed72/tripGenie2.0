import React, { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext(null);

export function TripProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [researchData, setResearchData] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('tg_token');
    const u = localStorage.getItem('tg_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const login = (t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem('tg_token', t);
    localStorage.setItem('tg_user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null); setUser(null);
    setPreferences(null); setResearchData(null); setItinerary(null);
    localStorage.removeItem('tg_token');
    localStorage.removeItem('tg_user');
  };

  return (
    <Ctx.Provider value={{ user, token, login, logout, preferences, setPreferences, researchData, setResearchData, itinerary, setItinerary }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTripContext = () => useContext(Ctx);