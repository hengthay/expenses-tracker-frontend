import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiShield,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRepeat,
  FiClock,
  FiAlertCircle,
  FiArrowRight
} from 'react-icons/fi';
import { BsLock } from 'react-icons/bs';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { fetchAllAccounts, fetchMyAccount, selectAccountError, selectAccounts, selectAccountStatus } from '../feature/account/accountSlice';
import AccountCard from '../components/account/AccountCard';
import { getCurrentUser, selectCurrentUser, selectRoleAdmin } from '../feature/auth/authSlice';

const TRANSACTION_TYPES = {
  INFLOW: {
    icon: FiArrowDownLeft,
    iconWrapper: 'bg-emerald-50 text-emerald-600',
    amountClass: 'text-emerald-600',
    sign: '+'
  },
  OUTFLOW: {
    icon: FiArrowUpRight,
    iconWrapper: 'bg-rose-50 text-rose-600',
    amountClass: 'text-rose-600',
    sign: '-'
  },
  TRANSFER: {
    icon: FiRepeat,
    iconWrapper: 'bg-slate-100 text-slate-700',
    amountClass: 'text-slate-900',
    sign: '+'
  }
};

const LEDGER_ACTIVITIES = [
  {
    id: 1,
    title: 'Quarterly Dividend Payout',
    subtitle: 'Automated Custodial Brokerage',
    type: 'INFLOW',
    ledgerName: 'Future Family',
    ledgerColor: 'bg-slate-900',
    category: 'Investments',
    date: 'Oct 03, 2026',
    source: 'Wire Transfer',
    amount: 2850.00
  },
  {
    id: 2,
    title: 'Cathay Pacific Booking',
    subtitle: 'Airline Ticketing Desk',
    type: 'OUTFLOW',
    ledgerName: 'New Monitor',
    ledgerColor: 'bg-emerald-500',
    category: 'Travel',
    date: 'Oct 02, 2026',
    source: 'Visa Debit',
    amount: 1420.50
  },
  {
    id: 3,
    title: 'Direct Deposit Paycheck',
    subtitle: 'Tech Flow Labs Payroll',
    type: 'INFLOW',
    ledgerName: 'Future Family',
    ledgerColor: 'bg-slate-900',
    category: 'Salary',
    date: 'Sep 30, 2026',
    source: 'ACH Transfer',
    amount: 5000.00
  },
  {
    id: 4,
    title: 'Internal Vault Rebalancing',
    subtitle: 'Vault Allocation Rule #4',
    type: 'TRANSFER',
    ledgerName: 'New Monitor',
    ledgerColor: 'bg-emerald-500',
    category: 'Transfer',
    date: 'Sep 29, 2026',
    source: 'Internal Swift',
    amount: 1500.00
  }
];

const Account = () => {

  const dispatch = useDispatch();

  // role user
  const myAccounts = useSelector(selectAccounts);
  const myAccountStatus = useSelector(selectAccountStatus);
  const myAccountError = useSelector(selectAccountError);

  const [selectedLedgerFilter, setSelectedLedgerFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchMyAccount());
  }, [dispatch]);

  // Ensure accounts is safe to use as an array
  const accountsList = useMemo(() => {
    return Array.isArray(myAccounts) ? myAccounts : [];
  }, [myAccounts]);

  const totalPortfolio = useMemo(() => {
    return accountsList.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
  }, [accountsList]);

  // Dynamic allocate
  const accountsWithShare = useMemo(() => {
    return accountsList.map((acc) => {
      const balance = Number(acc.balance) || 0;
      const share = totalPortfolio > 0 ? ((balance / totalPortfolio) * 100).toFixed(1) : '0.0';
      return {
        ...acc,
        balance,
        share: parseFloat(share)
      };
    });
  }, [accountsList, totalPortfolio]);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
    
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Treasury & Liquidity</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-700 font-bold">Real-time sync active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Accounts & Wallets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Manage active institutional vaults, high-yield cash reserves, and multi-tier operational ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button 
            onClick={() => dispatch(fetchMyAccount())}
            disabled={myAccountStatus === 'loading'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <FiRefreshCw className={`text-sm ${myAccountStatus === 'loading' ? 'animate-spin' : ''}`} />
            Reconcile Ledgers
          </button>
          <Link
            to="/accounts/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <FiPlus className="text-base" />
            Add New Account
          </Link>
        </div>
      </div>

      {myAccountError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertCircle className="text-lg shrink-0" />
          <span>{myAccountError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Liquid Portfolio
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ${totalPortfolio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <FiTrendingUp className="text-[11px]" />
                +18.4% YTD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Combined net holdings across all primary vaults
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <HiOutlineBuildingLibrary />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Ledgers
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {accountsList.length} Vaults
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                100% HEALTHY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-1 truncate max-w-55">
              {accountsList.map((a) => a.name).join(' & ') || 'No vaults opened'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <FiShield />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1 w-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Monthly Cash Inflow
            </span>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                +$5,000.00
              </span>
              <span className="text-xs text-slate-400 font-medium">Scheduled</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-600 h-full w-2/3 rounded-full"></div>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 ml-3">
            <FiArrowDownLeft />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="text-base">◵</span>
            <span>Asset Allocation Ratio</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <BsLock className="text-xs" />
              256-Bit Ledger Guard
            </span>
            <span className="inline-flex items-center gap-1">
              <FiShield className="text-xs" />
              Cloud Encrypted
            </span>
          </div>
        </div>

        {/* Dynamic Multi-segment Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
          {accountsWithShare.map((acc, index) => {
            const colors = ['bg-slate-900', 'bg-emerald-500', 'bg-indigo-500', 'bg-sky-400'];
            const barColor = colors[index % colors.length];
            return (
              <div
                key={acc.id}
                className={`h-full ${barColor} transition-all duration-500`}
                style={{ width: `${acc.share}%` }}
                title={`${acc.name}: ${acc.share}%`}
              />
            );
          })}
        </div>

        {/* Dynamic Allocation Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-1">
          {accountsWithShare.map((acc, index) => {
            const dotColors = ['bg-slate-900', 'bg-emerald-500', 'bg-indigo-500', 'bg-sky-400'];
            return (
              <div key={acc.id} className="flex items-center gap-2 text-xs">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColors[index % dotColors.length]}`}></span>
                <span className="font-semibold text-slate-800">{acc.name}</span>
                <span className="text-slate-500 font-mono">
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-slate-400 font-medium">({acc.share}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Active Vault Ledgers</h2>
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Sort by Balance (High to Low)
          </span>
        </div>

        {myAccountStatus === 'loading' && accountsList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <FiClock className="animate-spin text-sm" />
            Loading accounts from vault...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accountsWithShare.map((account) => {
              const isCash = account.type === 'CASH';

              return (<AccountCard account={account} isCash={isCash} key={account.id}/>);
            })}
          </div>
        )}
      </div>

      {/* List transactions */}

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-5">
      
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Ledger Activity Log</h2>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Last 5 entries
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setSelectedLedgerFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedLedgerFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All Accounts
              </button>
              {accountsList.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedLedgerFilter(a.name)}
                  className={`px-3 py-1 rounded-lg transition-all truncate max-w-30 ${
                    selectedLedgerFilter === a.name ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <Link
              to="/transactions"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View All in Transactions
              <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Transaction / Direction</th>
                <th className="py-3 px-3">Account Ledger</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date & Source</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {LEDGER_ACTIVITIES.map((activity) => {
                const config = TRANSACTION_TYPES[activity.type] || TRANSACTION_TYPES.TRANSFER;
                const IconComponent = config.icon;

                return (
                  <tr key={activity.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Transaction / Direction */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.iconWrapper}`}>
                          <IconComponent className="text-sm" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{activity.title}</span>
                          <span className="text-[11px] text-slate-400">{activity.subtitle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Account Ledger */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${activity.ledgerColor || 'bg-slate-900'}`}></span>
                        {activity.ledgerName}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        {activity.category}
                      </span>
                    </td>

                    {/* Date & Source */}
                    <td className="py-3.5 px-3 text-slate-500">
                      <div className="font-medium text-slate-700">{activity.date}</div>
                      <div className="text-[10px] text-slate-400">{activity.source}</div>
                    </td>

                    {/* Amount */}
                    <td className={`py-3.5 px-3 text-right font-black text-sm ${config.amountClass}`}>
                      {config.sign}${activity.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;