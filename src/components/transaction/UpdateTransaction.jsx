import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchTransactionById,
  updateTransaction,
  selectTransactionDataDetail,
  selectTransactionStatusDetail,
  selectTransactionErrorDetail
} from '../../feature/transactions/transactionSlice'; 
import { fetchCategories, selectAllCategories } from '../../feature/categories/categorySlice';
import {
  FiArrowLeft,
  FiSave,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiChevronDown,
  FiAlertCircle,
  FiClock,
  FiInfo,
  FiLock,
  FiArrowDownLeft,
  FiArrowUpRight
} from 'react-icons/fi';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';

const UpdateTransaction = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const transactionDetail = useSelector(selectTransactionDataDetail);
  const transactionStatusDetail = useSelector(selectTransactionStatusDetail);
  const transactionErrorDetail = useSelector(selectTransactionErrorDetail);
  const categories = useSelector(selectAllCategories);

  const availableCategories = categories || [];

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    type: 'EXPENSE',
    transactionDate: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch transaction and category
  useEffect(() => {
    if (id) dispatch(fetchTransactionById(id));
    if (typeof fetchCategories === 'function') {
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  // Pre-fill form 
  useEffect(() => {
    if (transactionDetail) {
      setFormData({
        categoryId: transactionDetail.category?.id || '',
        amount: transactionDetail.amount != null ? String(transactionDetail.amount) : '',
        type: transactionDetail.type || 'EXPENSE',
        transactionDate: transactionDetail.transactionDate || '',
        notes: transactionDetail.notes || ''
      });
    }
  }, [transactionDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formError) setFormError('');
  };

  const handleTypeSelect = (selectedType) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType
    }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.categoryId) {
      setFormError('Please select a category.');
      return;
    }

    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!formData.transactionDate) {
      setFormError('Transaction date is required.');
      return;
    }

    setFormError('');

    const payload = {
      categoryId: Number(formData.categoryId),
      amount: numericAmount,
      type: formData.type,
      transactionDate: formData.transactionDate,
      notes: formData.notes.trim()
    };

    try {
      await dispatch(
        updateTransaction({
          id,
          payload
        })
      ).unwrap();

      Swal.fire({
        title: 'Updated!',
        text: 'Transaction and account balances have been recomputed.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });

      const timeout = setTimeout(() => {
        navigate('/transactions');
      }, 1800);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error('Failed to update transaction:', err);
      Swal.fire({
        title: 'Update Failed',
        text: typeof err === 'string' ? err : err?.message || 'Unable to update transaction.',
        icon: 'error',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Compute live estimated delta for account balance
  const originalAmount = parseFloat(transactionDetail?.amount || 0);
  const currentInputAmount = parseFloat(formData.amount || 0);
  const originalType = transactionDetail?.type;

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/transactions"
          className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
        >
          <FiArrowLeft className="text-base" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Ledger Control</span>
            <span>/</span>
            <span className="text-slate-600 font-bold">Edit Entry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Update Transaction
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg shrink-0">
              <HiOutlineBuildingLibrary />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Modify Transaction Record</h2>
              <p className="text-xs text-slate-400">
                Updating values automatically recalculates your account's liquid balance.
              </p>
            </div>
          </div>

          {transactionStatusDetail === 'loading' ? (
            <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <FiClock className="animate-spin text-sm" />
              Loading transaction entry...
            </div>
          ) : (
            <>
              {(formError || transactionErrorDetail) && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
                  <FiAlertCircle className="text-base shrink-0" />
                  <span>{formError || transactionErrorDetail}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Account Vault
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {transactionDetail?.account?.name || 'Unassigned'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-2">
                      ({transactionDetail?.account?.type})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <FiLock className="text-sm" />
                    <span>Fixed Vault</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Flow Direction <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('EXPENSE')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        formData.type === 'EXPENSE'
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-1 ring-rose-600'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
                        formData.type === 'EXPENSE' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <FiArrowUpRight />
                      </div>
                      <div>
                        <div className="text-xs font-bold">EXPENSE</div>
                        <div className="text-[10px] text-slate-400">Debit account balance</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTypeSelect('INCOME')}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        formData.type === 'INCOME'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
                        formData.type === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <FiArrowDownLeft />
                      </div>
                      <div>
                        <div className="text-xs font-bold">INCOME</div>
                        <div className="text-[10px] text-slate-400">Credit account balance</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label htmlFor="updateCategoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="updateCategoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                        className="w-full appearance-none px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer pr-10"
                      >
                        <option value="" disabled>Select category...</option>
                        {availableCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} (ID: #{cat.id})
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="updateAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Amount (USD) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        id="updateAmount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="5000.00"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label htmlFor="updateTransactionDate" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Transaction Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="updateTransactionDate"
                      name="transactionDate"
                      type="date"
                      value={formData.transactionDate}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="updateNotes" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notes / Description
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    <textarea
                      id="updateNotes"
                      name="notes"
                      rows="3"
                      placeholder="e.g. Saving"
                      value={formData.notes}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Link
                    to="/transactions"
                    className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.categoryId || !formData.amount}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <FiSave className="text-sm" />
                    {isLoading ? 'Saving Ledger...' : 'Save Changes'}
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

          {/* Account Balance Preview */}
          {transactionDetail?.account && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Vault Balance Recomputation
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Vault:</span>
                <span className="font-bold text-slate-800">{transactionDetail.account.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Balance:</span>
                <span className="font-bold text-slate-900">
                  ${Number(transactionDetail.account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-500">Old Value:</span>
                <span className="font-semibold text-slate-600">
                  {originalType === 'INCOME' ? '+' : '-'}${originalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">New Value:</span>
                <span className={`font-semibold ${formData.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formData.type === 'INCOME' ? '+' : '-'}${currentInputAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* PUT Request Body */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PUT `/transactions/{id}` Payload
            </span>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
              {JSON.stringify(
                {
                  categoryId: formData.categoryId ? Number(formData.categoryId) : 1,
                  amount: parseFloat(formData.amount) || 5000.00,
                  type: formData.type || "EXPENSE",
                  transactionDate: formData.transactionDate || "2026-10-04",
                  notes: formData.notes || "Saving"
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

export default UpdateTransaction;