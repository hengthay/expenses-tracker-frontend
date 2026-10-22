import React from 'react'
import { formatDate } from '../helper/formatDate';
import { FiLock, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { deleteUser, resetUserStatus } from '../../feature/user/userSlice';

const UserCard = ({ user, isAdmin }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; 
    try {
      await dispatch(deleteUser(id)).unwrap();

      dispatch(resetUserStatus());

      Swal.fire({
        title: "Deleted",
        text: "User has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/users');
      }, 1500);

      return () => clearTimeout(timeoutId);

    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "User could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'ME';
    return name.slice(0, 2).toUpperCase();
  };
  
  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black tracking-wider shrink-0 ${
              isAdmin ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {getInitials(user?.username)}
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              {user?.username || '—'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              #{user?.id != null ? String(user.id) : '—'}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-3 text-slate-600 font-medium">
        {user?.email || '—'}
      </td>

      <td className="py-3.5 px-3">
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
            isAdmin
              ? 'bg-slate-900 text-white'
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {user?.role || 'USER'}
        </span>
      </td>

      <td className="py-3.5 px-3 text-slate-500 font-medium">
        {user?.createdAt ? formatDate(user?.createdAt) : "N/A"}
      </td>

      <td className="py-3.5 px-3 text-right">
        <div className="inline-flex items-center gap-2">
          <Link
            to={`/users/edit/${user?.id}`}
            title='Edit Role'
            className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Edit Role
          </Link>
          <button
            onClick={() => handleDelete(user?.id)}
            type='button'
            title='Remove User'
            className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FiTrash2 className="text-sm" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Lock / Revoke User"
          >
            <FiLock className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserCard