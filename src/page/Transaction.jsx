import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  FiPlus,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiRepeat,
  FiCalendar,
  FiClock,
  FiDownload,
  FiTag,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { BsWallet2, BsPiggyBank } from 'react-icons/bs';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { fetchMyTransactions, selectTransactionError, selectTransactions, selectTransactionStatus } from '../feature/transactions/transactionSlice';
import { formatDate } from '../components/helper/formatDate';
import TransactionCard from '../components/transaction/TransactionCard';

const Transaction = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions)
  const status = useSelector(selectTransactionStatus)
  const error = useSelector(selectTransactionError)

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); 
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    if (status === "idle") dispatch(fetchMyTransactions());
  }, [dispatch, status]);

  const rawTransactions = useMemo(() => {
    return Array.isArray(transactions) ? transactions : [];
  }, [transactions]);

  const categoriesList = useMemo(() => {
    const set = new Set();
    rawTransactions.forEach((tx) => {
      if (tx?.category?.name) set.add(tx.category.name);
    });
    return Array.from(set);
  }, [rawTransactions]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;

    rawTransactions.forEach((tx) => {
      const val = Number(tx.amount) || 0;
      if (tx.type === 'INCOME') income += val;
      if (tx.type === 'EXPENSE') expense += val;
    });

    return {
      income,
      expense,
      net: income - expense,
      totalCount: rawTransactions.length
    };
  }, [rawTransactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((tx) => {
      if (!tx) return false;

      const matchesType = selectedType === 'ALL' || tx.type === selectedType;
      const matchesCategory = selectedCategory === 'ALL' || tx.category?.name === selectedCategory;

      const query = (searchTerm || '').trim().toLowerCase();
      const matchesSearch =
        (tx.notes && tx.notes.toLowerCase().includes(query)) ||
        (tx.id && tx.id.toLowerCase().includes(query)) ||
        (tx.category?.name && tx.category.name.toLowerCase().includes(query)) ||
        (tx.account?.name && tx.account.name.toLowerCase().includes(query));

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [rawTransactions, selectedType, selectedCategory, searchTerm]);

  return (
    <div className="w-full max-w-360mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Ledger Control</span>
            <span>•</span>
            <span className="text-slate-600 font-bold">Personal Cashflow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transactions & Ledgers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track your inflows, routine expenses, and balances across your personal liquid accounts.
          </p>
        </div>

        <Link
          to="/transactions/create"
          className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <FiPlus className="text-base" />
          Add Transaction
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertCircle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Net Balance Flow
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-0.5">
              ${metrics.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              {metrics.totalCount} recorded transaction{metrics.totalCount === 1 ? '' : 's'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <HiOutlineBuildingLibrary />
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Inflows
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight pt-0.5">
              +${metrics.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium pt-1 flex items-center gap-1">
              <FiCheckCircle className="text-xs" /> Clean inflows recorded
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <FiArrowDownLeft />
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Outflows
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight pt-0.5">
              -${metrics.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1">
              Expenses and debit allocations
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
            <FiArrowUpRight />
          </div>
        </div>
      </div>

      {/* Filter*/}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Filter by note, ID, category..."
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
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> of {rawTransactions.length} entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Date & ID</th>
                <th className="py-3 px-3">Description / Notes</th>
                <th className="py-3 px-3">Account & Ledger</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Direction</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {status === 'loading' && rawTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <FiClock className="animate-spin text-sm" />
                      Loading personal ledger...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';

                  return (<TransactionCard tx={tx} isIncome={isIncome} key={tx?.id}/>);
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Transaction;