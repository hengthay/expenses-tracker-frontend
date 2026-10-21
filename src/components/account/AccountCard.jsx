import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiCopy,
  FiMoreVertical,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../helper/formatDate";
import { BsPiggyBank, BsWallet2 } from "react-icons/bs";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  deleteAccount,
  resetAccountStatus,
} from "../../feature/account/accountSlice";
import { TbUserEdit } from "react-icons/tb";

const AccountCard = ({ account, isCash }) => {
  // Clipboard copy handler for UUID
  const [copiedId, setCopiedId] = useState(null);
  const [toggleToDelete, setToggleToDelete] = useState(false);

  const handleToOpenToggleButton = () => {
    setToggleToDelete((prev) => !prev);
  }

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
        navigate("/accounts");
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
    <div
      key={account.id}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative space-y-6"
    >
      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
              isCash
                ? "bg-slate-900 text-white"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isCash ? <BsWallet2 /> : <BsPiggyBank />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base">
                {account.name}
              </h3>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isCash
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {account.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isCash
                ? "Primary Household Reserve"
                : "High-Yield Operational Reserve"}
            </p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={handleToOpenToggleButton}
            className={`p-1.5 rounded-xl transition-colors ${
              toggleToDelete 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            }`}
            aria-label="Account Options"
          >
            <FiMoreVertical className="text-base" />
          </button>

          {toggleToDelete && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-xl shadow-slate-900/5 z-20 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => handleDelete(account?.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-colors group cursor-pointer text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-50 group-hover:bg-rose-100/70 text-rose-600 flex items-center justify-center transition-colors">
                  <FiTrash2 className="text-xs" />
                </div>
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Current Balance
          </span>
          <div className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            $
            {account.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Portfolio Share
          </span>
          <div className="text-lg font-black text-slate-800 mt-0.5">
            {account.share}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            Owner & Authority
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800">
              {account.userDto?.username || "—"}
            </span>
            {account.userDto?.role && (
              <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">
                {account.userDto.role}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 block truncate">
            {account.userDto?.email}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            Ledger Timestamps
          </span>
          <div className="text-[11px] text-slate-500">
            Created:{" "}
            <span className="font-medium text-slate-700">
              {formatDate(account.createdAt)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Updated:{" "}
            <span className="font-medium text-slate-700">
              {formatDate(account.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-400 font-sans text-[11px]">ID:</span>
          <span className="truncate">{account.id}</span>
        </div>
        <button
          onClick={() => handleCopy(account.id)}
          className="ml-2 p-1 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          title="Copy Ledger UUID"
        >
          {copiedId === account.id ? (
            <FiCheck className="text-emerald-600 text-sm" />
          ) : (
            <FiCopy className="text-sm" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-1">
        <Link
          to={"/transactions/create"}
          title="Make a deposit"
          className="col-span-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
        >
          <FiPlus className="text-sm" />
          Deposit
        </Link>
        <Link
          to={"/transactions/create"}
          title="Make a withdraw"
          className="col-span-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
        >
          <FiArrowUpRight className="text-xs" />
          Withdraw
        </Link>
        <Link
          to={`/accounts/edit/${account?.id}`}
          title="Update an account"
          className="col-span-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
        >
          <TbUserEdit className="text-xs" />
          Update Account
        </Link>
        <button className="col-span-1 inline-flex items-center justify-center py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all">
          <FiClock className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
