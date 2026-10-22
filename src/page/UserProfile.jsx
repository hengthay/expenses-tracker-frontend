import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetAuthStatus, selectCurrentUser } from '../feature/auth/authSlice'; 
import {
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiSmartphone,
  FiEdit3,
  FiActivity,
  FiSave
} from 'react-icons/fi';
import { BsShieldCheck } from 'react-icons/bs';
import { resetUserStatus, updateUser } from '../feature/user/userSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user
  const currentUser = useSelector(selectCurrentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
  });

  const getInitials = (name) => {
    if (!name) return 'ME';
    return name.slice(0, 2).toUpperCase();
  };

  const id = currentUser?.id;

  const handleOnChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      if (!formData.username.trim()) {
        setFormError('Name is required.');
        return;
      }

      if(!formData.email) {
        setFormError('Email is required.');
        return;
      }

      setFormError('');

      await dispatch(updateUser({ id, formData })).unwrap();

      dispatch(resetUserStatus());
      dispatch(resetAuthStatus());

      Swal.fire({
        title: "Successfully",
        text: "User Updated",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/users');
      }, 2000);

      // Clear form
      setFormData({
        username: '',
        email: ""
      })

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Error to update user",
        icon: 'error',
        timer: 2000,
      })
    } finally {
      setFormData({
        username: '',
        email: ""
      })
      setIsEditing(false);
      setFormError(null);
    }
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          <span>Identity & Security</span>
          <span>•</span>
          <span className="text-slate-600 font-bold">Personal Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          User Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Manage your personal credentials, identity profile, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shrink-0">
                {getInitials(currentUser?.username)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {currentUser?.username || 'User Profile'}
                  </h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700">
                    {currentUser?.role || 'USER'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  User Record ID: <span className="font-mono font-semibold text-slate-600">#{currentUser?.id || '—'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <FiEdit3 className="text-xs" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          <form onSubmit={handleOnSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name='username'
                  value={formData.username}
                  disabled={!isEditing}
                  onChange={handleOnChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-900 disabled:bg-slate-50/70 disabled:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  name='email'
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={handleOnChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-900 disabled:bg-slate-50/70 disabled:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Assigned System Role
              </label>
              <div className="relative">
                <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={currentUser?.role || 'USER'}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-semibold cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Role tiers and permissions can only be granted by an administrator.
              </p>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <FiSave className="text-sm" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              <BsShieldCheck className="text-emerald-600 text-base" />
              <span>Security Posture</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center text-sm shadow-xs">
                  <FiLock />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">Password</div>
                  <div className="text-[11px] text-slate-400">••••••••••••</div>
                </div>
              </div>
              <button className="text-xs font-bold text-slate-900 hover:underline">
                Update
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 flex items-center justify-center text-sm shadow-xs">
                  <FiSmartphone />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800">Two-Factor Authentication</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Enabled (Authenticator App)</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <FiActivity className="text-slate-400 text-base" />
              <span>Current Session</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Session Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Authenticated
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Token Type</span>
              <span className="font-mono text-slate-700 font-bold">Bearer JWT</span>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default UserProfile;