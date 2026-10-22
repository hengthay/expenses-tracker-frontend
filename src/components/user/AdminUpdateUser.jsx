import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchUserById,
  resetUserStatus,
  selectUserDataDetail,
  selectUserErrorDetail,
  selectUserStatusDetail,
  updateUserByAdmin
} from '../../feature/user/userSlice';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiShield,
  FiSave,
  FiClock,
  FiHash,
  FiAlertCircle,
  FiChevronDown,
  FiInfo
} from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { formatDate } from '../helper/formatDate';
import { resetAuthStatus } from '../../feature/auth/authSlice';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Standard User' },
  { value: 'ADMIN', label: 'System Administrator' }
];

const AdminUpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER'
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userDetail = useSelector(selectUserDataDetail);
  const userStatusDetail = useSelector(selectUserStatusDetail);
  const userErrorDetail = useSelector(selectUserErrorDetail);

  // Fetch target user detail on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  // Pre-fill form when userDetail is loaded
  useEffect(() => {
    if (!userDetail) return;

    setFormData({
      username: userDetail?.username ?? '',
      email: userDetail?.email ?? '',
      role: userDetail?.role ?? 'USER'
    });
  }, [userDetail]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setFormError('Username is required.');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Email address is required.');
      return;
    }

    setFormError('');
    setIsLoading(true);

    try {
      await dispatch(
        updateUserByAdmin({
          id,
          payload: {
            username: formData.username.trim(),
            email: formData.email.trim(),
            role: formData.role
          }
        })
      ).unwrap();

      dispatch(resetUserStatus());
      dispatch(resetAuthStatus());

      Swal.fire({
        title: 'Success!',
        text: 'User profile updated successfully.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });

      const timeout = setTimeout(() => {
        navigate('/users');
      }, 1800);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Failed to update user:', error);
      Swal.fire({
        title: 'Update Failed',
        text: typeof error === 'string' ? error : 'Unable to update user information.',
        icon: 'error',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex items-center gap-3">
        <Link
          to="/users"
          className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
        >
          <FiArrowLeft className="text-base" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Access Governance</span>
            <span>/</span>
            <span className="text-slate-600 font-bold">Edit Member #{id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Update User Identity
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg shrink-0">
              <HiOutlineUserCircle />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">User Credentials & Clearance</h2>
              <p className="text-xs text-slate-400">
                Update account email, display identifier, and administrative privileges.
              </p>
            </div>
          </div>

          {userStatusDetail === 'loading' ? (
            <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <FiClock className="animate-spin text-sm" />
              Loading user record from database...
            </div>
          ) : (
            <>
              {(formError || userErrorDetail) && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
                  <FiAlertCircle className="text-base shrink-0" />
                  <span>{formError || userErrorDetail}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Database Record ID
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      value={id ? `#${id}` : ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 bg-slate-100/70 text-slate-500 text-xs font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="e.g. jdoe"
                      value={formData.username}
                      onChange={handleOnChange}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="user@organization.com"
                      value={formData.email}
                      onChange={handleOnChange}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role Clearance <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleOnChange}
                      disabled={isLoading}
                      className="w-full appearance-none pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.value} — {opt.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base" />
                  </div>
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Assigning ADMIN permits full management of vaults, categories, and identities.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Link
                    to="/users"
                    className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.username.trim() || !formData.email.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <FiSave className="text-sm" />
                    {isLoading ? 'Saving Identity...' : 'Save User Changes'}
                  </button>
                </div>

              </form>
            </>
          )}

        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <FiInfo className="text-base text-slate-500" />
            <span>Inspection & Live Payload</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Identity Profile
              </span>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                  formData.role === 'ADMIN'
                    ? 'bg-slate-900 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {formData.role}
              </span>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-sm">
                {formData.username.trim() || 'Username Preview'}
              </div>
              <div className="text-xs text-slate-500">
                {formData.email.trim() || 'email@organization.com'}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Member Since:</span>
              <span className="font-medium text-slate-700">
                {userDetail?.createdAt ? formatDate(userDetail?.createdAt) : "N/A"}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PUT `/users/{id}` Payload
            </span>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
              {JSON.stringify(
                {
                  username: formData.username.trim() || 'username',
                  email: formData.email.trim() || 'user@example.com',
                  role: formData.role
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminUpdateUser;