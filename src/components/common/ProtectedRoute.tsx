import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/authUtils';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'tradie';
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in, has a valid token, and token is not expired
  if (!isLoggedIn || !token || !isTokenValid()) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
