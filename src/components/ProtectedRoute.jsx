import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectUserToken } from '../feature/auth/authSlice';
import { API_BASE_URL, axiosInstace } from './APIConfig';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userToken = useSelector(selectUserToken);

  useEffect(() => {
    if(!userToken) {
      setIsAuthenticated(false);
      return;
    }

    axiosInstace.get(`${API_BASE_URL}/auth/health-check`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken?.token}`
      }
    })
    .then(() => setIsAuthenticated(true))
    .catch(() => setIsAuthenticated(false));
  }, [userToken]);

  if(!userToken) return <Navigate to={'/login'} replace /> // if token not exist redirect user to login page

  return <Outlet />;
}

export default ProtectedRoute