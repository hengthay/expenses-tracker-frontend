import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiTag,
  FiCalendar,
  FiFolder,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';
import { fetchCategories, selectAllCategories, selectCategoryError, selectCategoryStatus } from '../feature/categories/categorySlice';
import CategoryCard from '../components/category/CategoryCard';
import { formatDate } from '../components/helper/formatDate';
import LoadingState from '../components/helper/LoadingState';
import ErrorMessage from '../components/helper/ErrorMessage';

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectAllCategories);
  const status = useSelector(selectCategoryStatus);
  const error = useSelector(selectCategoryError);

  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const categoryList = Array.isArray(categories) ? categories : [];

  console.log(categoryList);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!categoryList) return [];
    return categoryList.filter((cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cat.id).includes(searchTerm)
    );
  }, [categoryList, searchTerm]);

  // Derive recent count 
  const recentCategoriesCount = useMemo(() => {
    if (categoryList) return 0;
    const now = new Date();
    return categoryList.filter((c) => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [categoryList]);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
              Categories & Tags
            </span>
            <span>•</span>
            <span>Expense Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transaction Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Manage and inspect category labels used to classify your inflows and expenditures.
          </p>
        </div>

        <Link 
          to="/categories/create"
          className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <FiPlus className="text-base" />
          New Category
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm">
          <FiAlertCircle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Categories
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">
                {categories?.length || 0}
              </span>
              <span className="text-xs text-slate-400 font-medium">Recorded</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
            <FiFolder />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              New Additions
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-600">
                {recentCategoriesCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">This month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <FiCalendar />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Latest Category
            </div>
            <div className="mt-1">
              <span className="text-lg font-black text-slate-900 block truncate max-w-45">
                {categoryList[0]?.name || 'None'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {categoryList[0] ? formatDate(categoryList[0].createdAt) : 'No entries'}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center text-xl">
            <FiTag />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-5">
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Category Directory</h2>
            <p className="text-xs text-slate-400 font-medium">
              List of all system categories fetched directly from your database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-60">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search category name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
              />
            </div>
            <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-600 whitespace-nowrap">
              {filteredCategories.length} / {categoryList?.length || 0}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Category ID</th>
                <th className="py-3 px-3">Category Name</th>
                <th className="py-3 px-3">Created Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {status === 'loading' ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400">
                    <LoadingState />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-400">
                    <ErrorMessage message={'No categories found.'}/>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <CategoryCard cat={cat} key={cat.id}/>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default Category;