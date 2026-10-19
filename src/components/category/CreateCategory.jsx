import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPlus,
  FiFolderPlus,
  FiAlertCircle,
  FiTag,
  FiInfo
} from 'react-icons/fi';
import { createCategory, resetCategoryStatus, selectCategoryError } from '../../feature/categories/categorySlice';
import Swal from 'sweetalert2';

const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectCategoryError);
  
  const [form, setForm] = useState({
    name: ""
  });

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const {name, value} = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!form.name.trim()) {
        setFormError('Category name is required.');
        return;
      }

      setFormError('');

      await dispatch(createCategory(form)).unwrap();

      // reset status
      dispatch(resetCategoryStatus())

      Swal.fire({
        title: "Successfully",
        text: "Category created",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/categories');
      }, 2000);

      // Clear form
      setForm({ name: "" })

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Error to create category",
        icon: 'error',
        timer: 2000,
      })
    } finally {
      setForm({ name: "" })
      setIsLoading(false);
    }
  };

  console.log(form);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/categories"
          className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
        >
          <FiArrowLeft className="text-base" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Categories</span>
            <span>/</span>
            <span className="text-slate-600">New Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Category
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg shrink-0">
              <FiFolderPlus />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Category Details</h2>
              <p className="text-xs text-slate-400">
                Define the title that will identify transactions in this classification.
              </p>
            </div>
          </div>

          {(formError || error) && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{formError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label 
                htmlFor="name" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Category Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="name"
                  type="text"
                  name='name'
                  placeholder="e.g. cate 4"
                  value={form.name}
                  onChange={handleOnChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Keep the name concise and distinct so you can easily filter reports later.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/dashboard/categories"
                className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !form.name.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
              >
                <FiPlus className="text-sm" />
                {isLoading ? 'Creating Category...' : 'Save Category'}
              </button>
            </div>
          </form>

        </div>

        {/* Right Info Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <FiInfo className="text-base text-slate-500" />
            <span>Category Guidelines</span>
          </div>
          
          <ul className="space-y-3 text-xs text-slate-500">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span>
                <strong>Clear Labeling:</strong> Names like "cate 4", "Travel", or "Rent" help when aggregating transaction summaries.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span>
                <strong>System Timestamp:</strong> The server automatically timestamps each record with an ISO creation date upon submission.
              </span>
            </li>
          </ul>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Backend Payload Preview
            </span>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
{JSON.stringify({ name: name.trim() || "cate 4" }, null, 2)}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CreateCategory;