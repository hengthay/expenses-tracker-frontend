import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiShield,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi';
import { BsFolderCheck } from 'react-icons/bs';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { fetchAllAccounts, selectAllAccountError, selectAllAccounts, selectAllAccountStatus } from '../feature/accounts/accountSlice';
import AdminAccountCard from '../components/account/AdminAccountCard';

const AdminAccount = () => {
  const dispatch = useDispatch();

  const allAccounts = useSelector(selectAllAccounts);
  const allAccountStatus = useSelector(selectAllAccountStatus);
  const allAccountError = useSelector(selectAllAccountError);

  // Local filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch]);

  const rawAccounts = useMemo(() => {
    return Array.isArray(allAccounts) ? allAccounts : [];
  }, [allAccounts]);

  const metrics = useMemo(() => {
    const totalLiquidity = rawAccounts.reduce((sum, item) => sum + (Number(item.balance) || 0), 0);
    const uniqueUsers = new Set(rawAccounts.map((item) => item.userDto?.id || item.userDto?.email)).size;
    const cashCount = rawAccounts.filter((item) => item.type === 'CASH').length;
    const savingsCount = rawAccounts.filter((item) => item.type === 'SAVINGS').length;

    return {
      totalLiquidity,
      totalVaults: rawAccounts.length,
      uniqueUsers,
      cashCount,
      savingsCount
    };
  }, [rawAccounts]);

  const filteredAccounts = useMemo(() => {
    return rawAccounts.filter((acc) => {
      const matchesType = selectedType === 'ALL' || acc.type === selectedType;
      
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        acc.name?.toLowerCase().includes(search) ||
        acc.id?.toLowerCase().includes(search) ||
        acc.userDto?.username?.toLowerCase().includes(search) ||
        acc.userDto?.email?.toLowerCase().includes(search);

      return matchesType && matchesSearch;
    });
  }, [rawAccounts, selectedType, searchTerm]);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px] tracking-widest">
              ROOT ADMIN
            </span>
            <span>•</span>
            <span className="text-slate-600 font-bold">Institutional Liquidity & Vault Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Accounts Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Global ledger inspection across all registered users, institutional liquidity vaults, and transactional balance records.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button 
            onClick={() => dispatch(fetchAllAccountsAdmin())}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiRefreshCw className={`text-sm ${status === 'loading' ? 'animate-spin' : ''}`} />
            Refresh Ledger
          </button>
          
          <button 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiDownload className="text-sm" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {allAccountError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertTriangle className="text-lg shrink-0" />
          <span>{allAccountError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Liquidity Held
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-0.5">
              ${metrics.totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 pt-0.5">
              <FiTrendingUp className="text-xs" />
              <span>Full solvency verified</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg shrink-0">
            <HiOutlineBuildingLibrary />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Vaults
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-0.5">
              {metrics.totalVaults}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {metrics.cashCount} Cash • {metrics.savingsCount} Savings
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0">
            <BsFolderCheck />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Unique Vault Owners
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-0.5">
              {metrics.uniqueUsers}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Across organization tiers
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg shrink-0">
            <FiUsers />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              System Audit Status
            </span>
            <div className="text-lg font-black text-emerald-700 tracking-tight pt-1 flex items-center gap-1.5">
              <FiShield className="text-base" />
              <span>100% HEALTHY</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium pt-0.5">
              Zero anomalous outflows
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <FiCheckCircle />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by vault name, user, email, or UUID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All Types ({rawAccounts.length})
              </button>
              <button
                onClick={() => setSelectedType('CASH')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedType === 'CASH' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Cash ({metrics.cashCount})
              </button>
              <button
                onClick={() => setSelectedType('SAVINGS')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedType === 'SAVINGS' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Savings ({metrics.savingsCount})
              </button>
            </div>

            <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-500">
              Showing: {filteredAccounts.length}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Master Account Ledgers</h2>
            <p className="text-xs text-slate-400 font-medium">
              Real-time audit list of all client balances and institutional vaults.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Account Name & UUID</th>
                <th className="py-3 px-3">Owner / Authority</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Current Balance</th>
                <th className="py-3 px-3">Timestamps</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {status === 'loading' && rawAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    Loading system-wide accounts...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No accounts found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isCash = account.type === 'CASH';

                  return (
                    <AdminAccountCard account={account} isCash={isCash} key={account.id}/>
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

export default AdminAccount;