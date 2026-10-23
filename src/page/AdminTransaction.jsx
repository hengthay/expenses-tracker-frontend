import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiAlertTriangle,
  FiUser
} from 'react-icons/fi';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { fetchAllTransactions, selectAllTransactionError, selectAllTransactions, selectAllTransactionStatus } from '../feature/transactions/transactionSlice';
import { formatDate } from '../components/helper/formatDate';
import AdminTransactionCard from '../components/transaction/AdminTransactionCard';

const AdminTransaction = () => {
  const dispatch = useDispatch();

  const allTransactions = useSelector(selectAllTransactions)
  const allStatus = useSelector(selectAllTransactionStatus)
  const allError = useSelector(selectAllTransactionError)

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState('ALL');

  useEffect(() => {
    if (allStatus === "idle") dispatch(fetchAllTransactions());
    
  }, [dispatch, allStatus]);

  const rawTransactions = useMemo(() => {
    return Array.isArray(allTransactions) ? allTransactions : [];
  }, [allTransactions]);

  // Extract unique users from account.userDto
  const usersList = useMemo(() => {
    const map = new Map();
    rawTransactions.forEach((tx) => {
      const u = tx?.account?.userDto;
      if (u?.id && !map.has(u.id)) {
        map.set(u.id, u.username);
      }
    });
    return Array.from(map.entries()).map(([id, username]) => ({ id, username }));
  }, [rawTransactions]);

  // stats
  const stats = useMemo(() => {
    let totalVolume = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    rawTransactions.forEach((tx) => {
      totalVolume += Number(tx.amount) || 0;
      if (tx.type === 'INCOME') incomeCount++;
      if (tx.type === 'EXPENSE') expenseCount++;
    });

    return {
      totalVolume,
      totalCount: rawTransactions.length,
      incomeCount,
      expenseCount
    };
  }, [rawTransactions]);

  // Filtered transaction
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((tx) => {
      if (!tx) return false;

      const matchesType = selectedType === 'ALL' || tx.type === selectedType;
      const matchesUser =
        selectedUser === 'ALL' || String(tx.account?.userDto?.id) === String(selectedUser);

      const query = (searchTerm || '').trim().toLowerCase();
      const matchesSearch =
        (tx.notes && tx.notes.toLowerCase().includes(query)) ||
        (tx.id && tx.id.toLowerCase().includes(query)) ||
        (tx.account?.name && tx.account.name.toLowerCase().includes(query)) ||
        (tx.account?.userDto?.username && tx.account.userDto.username.toLowerCase().includes(query)) ||
        (tx.category?.name && tx.category.name.toLowerCase().includes(query));

      return matchesType && matchesUser && matchesSearch;
    });
  }, [rawTransactions, selectedType, selectedUser, searchTerm]);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px] tracking-widest">
              ROOT AUDITOR
            </span>
            <span>•</span>
            <span className="text-slate-600 font-bold">Multi-Account Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Accounts & Cashflow Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Audit system-wide financial transactions across all registered user accounts and vaults.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => dispatch(fetchAllTransactions())}
            disabled={allStatus === 'loading'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiRefreshCw className={`text-sm ${allStatus === 'loading' ? 'animate-spin' : ''}`} />
            Sync Ledger
          </button>
          
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiDownload className="text-sm" />
            Export CSV
          </button>

          <Link
            to={"/transactions/create"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <FiPlus className="text-base" />
            Add Transaction
          </Link>
        </div>
      </div>

      {allError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertTriangle className="text-lg shrink-0" />
          <span>{allError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Cumulative Ledger Volume
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-0.5">
              ${stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Audit trail for {stats.totalCount} transactions
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <HiOutlineBuildingLibrary />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Global Inflow Count
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight pt-0.5">
              {stats.incomeCount}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Confirmed income operations
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <FiArrowDownLeft />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Global Outflow Count
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight pt-0.5">
              {stats.expenseCount}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Confirmed expense operations
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
            <FiArrowUpRight />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Filter by note, ID, user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Vault Owners</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> entries
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Date & ID</th>
                <th className="py-3 px-3">Description / Notes</th>
                <th className="py-3 px-3">Account & Ledger</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Direction</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {allStatus === 'loading' && rawTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FiClock className="animate-spin text-sm" />
                      Loading global audit matrix...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  const owner = tx.account?.userDto;

                  return (
                    <AdminTransactionCard tx={tx} isIncome={isIncome} owner={owner} key={tx?.id}/>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default AdminTransaction;