import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiUsers,
  FiSearch,
  FiUserPlus,
  FiShield,
  FiRefreshCw,
  FiClock,
  FiAlertTriangle
} from 'react-icons/fi';
import { BsShieldCheck } from 'react-icons/bs';
import UserCard from '../components/user/UserCard';
import { fetchAllUsers, selectUserError, selectUsers, selectUserStatus } from '../feature/user/userSlice';

const AdminUserProfile = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector(selectUsers);
  const allUserStatus = useSelector(selectUserStatus);
  const allUserError = useSelector(selectUserError);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  useEffect(() => {
    if(allUserStatus === "idle") dispatch(fetchAllUsers());
  }, [dispatch, allUserStatus]);

  const rawUsers = useMemo(() => {
    return Array.isArray(allUsers) ? allUsers : [];
  }, [allUsers]);

  const stats = useMemo(() => {
    const total = rawUsers.length;
    const adminCount = rawUsers.filter((u) => u?.role === 'ADMIN').length;
    const regularCount = total - adminCount;

    return { total, adminCount, regularCount };
  }, [rawUsers]);

  const filteredUsers = useMemo(() => {
    return rawUsers.filter((user) => {
      if (!user) return false;
      const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
      const query = (searchTerm || '').trim().toLowerCase();

      const usernameMatch = user.username ? user.username.toLowerCase().includes(query) : false;
      const emailMatch = user.email ? user.email.toLowerCase().includes(query) : false;
      const idMatch = user.id != null ? String(user.id).toLowerCase().includes(query) : false;

      return matchesRole && (usernameMatch || emailMatch || idMatch);
    });
  }, [rawUsers, selectedRole, searchTerm]);


  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span className="text-slate-600 font-bold">Access Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Users & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure system permission tiers, authorized team identities, and security access scopes.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button 
            type="button"
            onClick={() => dispatch(fetchAllUsers())}
            disabled={allUserStatus === 'loading'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiRefreshCw className={`text-sm ${allUserStatus === 'loading' ? 'animate-spin' : ''}`} />
            Refresh Directory
          </button>
          
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <FiUserPlus className="text-base" />
            + Invite Team Member
          </button>
        </div>
      </div>

      {allUserError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertTriangle className="text-lg shrink-0" />
          <span>{allUserError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Identities
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {String(stats.total).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-slate-400">Registered Seats</span>
            </div>
            <div className="flex items-center gap-1.5 pt-2">
              <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                {stats.adminCount} Admin
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {stats.regularCount} User Tier
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <FiUsers />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Zero-Trust Posture
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-3xl font-black text-emerald-600 tracking-tight">
                100%
              </span>
              <span className="text-xs font-semibold text-slate-400">MFA Enforced</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Hardware & TOTP Token Attested
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <BsShieldCheck />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Authorization Model
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                Role-Based (RBAC)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Enforced at Spring Security API Layer
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg shrink-0">
            <FiShield />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Directory Roster</h2>
            <p className="text-xs text-slate-400 font-medium">
              List of all user identities retrieved from the administrative endpoint.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setSelectedRole('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedRole === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setSelectedRole('ADMIN')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedRole === 'ADMIN' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Admins ({stats.adminCount})
              </button>
              <button
                onClick={() => setSelectedRole('USER')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedRole === 'USER' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Users ({stats.regularCount})
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search username, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Identity</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role Tier</th>
                <th className="py-3 px-3">Registered Date</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {allUserStatus === 'loading' && rawUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FiClock className="animate-spin text-sm" />
                      Loading system users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user?.role === 'ADMIN';

                  return (
                    <UserCard user={user} isAdmin={isAdmin} key={user?.id}/>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;