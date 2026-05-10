import { Navigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

export default function ProtectedRoute({ children }) {
  const { token } = useTripContext();
  return token ? children : <Navigate to="/login" replace />;
}