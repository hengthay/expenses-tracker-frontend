import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getCurrentUser, 
  selectCurrentUser, 
  selectRoleAdmin,
} from '../feature/auth/authSlice';
import { Navigate } from 'react-router-dom';

const AccountRoleBaseRoute = ({ userComponent: UserComp, adminComponent: AdminComp }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectRoleAdmin);
  const authStatus = useSelector((state) => state.auth?.status);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // Prevent rendering either component while user info is being fetched
  if (authStatus === 'loading') {
    return (
      <div className="w-full min-h-100 flex items-center justify-center text-slate-400 text-sm">
        Verifying permissions...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin === "ADMIN" ? <AdminComp /> : <UserComp />;
};

export default AccountRoleBaseRoute;