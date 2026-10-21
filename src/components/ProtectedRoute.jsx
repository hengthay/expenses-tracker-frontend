import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserToken } from '../feature/auth/authSlice';
import { axiosInstance } from './APIConfig';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  const reduxToken = useSelector(selectUserToken);
  const rawToken = reduxToken || localStorage.getItem('userData');
  
  const tokenString = typeof rawToken === 'object' && rawToken !== null 
    ? rawToken.token 
    : rawToken;

  useEffect(() => {
    if (!tokenString) {
      setIsAuthenticated(false);
      return;
    }

    axiosInstance.get(`/auth/health-check`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenString}`
      }
    })
    .then(() => setIsAuthenticated(true))
    .catch((err) => {
      console.error("Health-check verification failed:", err);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    });
  }, [tokenString]);

  if (isAuthenticated === null) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-2">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase">Authenticating session...</span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;