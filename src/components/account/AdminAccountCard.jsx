import { useState } from "react";
import { FiCheck, FiCopy, FiExternalLink, FiLock, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../helper/formatDate";
import { BsPiggyBank, BsWallet2 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteAccount, resetAccountStatus } from "../../feature/accounts/accountSlice";
import Swal from "sweetalert2";

const AdminAccountCard = ({ account, isCash }) => {
  const [copiedId, setCopiedId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This account will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; 
    try {
      await dispatch(deleteAccount(id)).unwrap();

      dispatch(resetAccountStatus());

      Swal.fire({
        title: "Deleted",
        text: "Account has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/accounts');
      }, 1500);

      return () => clearTimeout(timeoutId);

    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your account could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <tr key={account.id} className="hover:bg-slate-50/70 transition-colors">
      <td className="py-4 px-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5 ${
              isCash
                ? "bg-slate-900 text-white"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isCash ? <BsWallet2 /> : <BsPiggyBank />}
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              {account.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-0.5">
              <span
                className="truncate max-w-40 sm:max-w-50"
                title={account.id}
              >
                {account.id}
              </span>
              <button
                onClick={() => handleCopy(account.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy UUID"
              >
                {copiedId === account.id ? (
                  <FiCheck className="text-emerald-600 text-xs" />
                ) : (
                  <FiCopy className="text-xs" />
                )}
              </button>
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800">
              {account.userDto?.username || "—"}
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                account.userDto?.role === "ADMIN"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {account.userDto?.role || "USER"}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block truncate max-w-45">
            {account.userDto?.email}
          </span>
        </div>
      </td>

      <td className="py-4 px-3">
        <span
          className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
            isCash
              ? "bg-emerald-100 text-emerald-800"
              : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {account.type}
        </span>
      </td>

      <td className="py-4 px-3">
        <span className="text-sm font-black text-slate-900">
          $
          {Number(account.balance || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </td>

      <td className="py-4 px-3 text-slate-500">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400">Created:</span>
          <span className="font-medium text-slate-700">
            {formatDate(account.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-400">Updated:</span>
          <span className="font-medium text-slate-700">
            {formatDate(account.updatedAt)}
          </span>
        </div>
      </td>

      <td className="py-4 px-3 text-right">
        <div className="inline-flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Audit Transactions"
          >
            <FiExternalLink className="text-sm" />
          </button>
          <button
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            title="Freeze/Lock Vault"
          >
            <FiLock className="text-sm" />
          </button>
          <button
            onClick={() => handleDelete(account?.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Purge Ledger"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminAccountCard;
