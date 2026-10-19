import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clearCategoryDetail, fetchCategoryById, resetCategoryStatus, selectCategoryById, selectCategoryError, selectCategoryStatusDetail, updateCategory } from '../../feature/categories/categorySlice';
import { formatDate } from '../helper/formatDate';
import { FiAlertCircle, FiArrowLeft, FiCalendar, FiClock, FiEdit3, FiHash, FiInfo, FiSave, FiTag, FiTrash2 } from 'react-icons/fi';

const UpdateCategory = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: ""
  });

  console.log(id);

  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const error = useSelector(selectCategoryError);
  const categoryDataDetail = useSelector(selectCategoryById);
  const statusDetail = useSelector(selectCategoryStatusDetail);

  const handleOnChange = (e) => {
    const {name, value} = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // fetch category for update
  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
    }
    return () => {
      dispatch(clearCategoryDetail());
    };
  }, [id, dispatch]);

  // Pre-fill
  useEffect(() => {
    if (categoryDataDetail?.name) {
      setForm({ name: categoryDataDetail?.name ?? ""});
    }
  }, [categoryDataDetail]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!form.name.trim()) {
        setFormError('Category name is required.');
        return;
      }

      setFormError('');

      const payload = {...form};

      await dispatch(updateCategory({ id, payload })).unwrap();

      // reset status
      dispatch(resetCategoryStatus())

      Swal.fire({
        title: "Successfully",
        text: "Category updated",
        icon: 'success',
        timer: 2000,
      })

      const timeOut = setTimeout(() => {
        navigate('/categories');
      }, 2000);

      // Clear form
      setForm({ name: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Error to update category",
        icon: 'error',
        timer: 2000,
      })
    } finally {
      setForm({ name: ""})
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; 
    try {
      await dispatch(deleteCategory(id)).unwrap();

      dispatch(resetCategoryStatus());

      Swal.fire({
        title: "Deleted",
        text: "Category has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/categories');
      }, 1500);

      return () => clearTimeout(timeoutId);

    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your category could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };
  
  console.log(form);

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      {/* Navigation & Breadcrumb */}
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
            <span className="text-slate-600">Edit Category #{id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Update Category
          </h1>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0">
                <FiEdit3 />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Edit Category Info</h2>
                <p className="text-xs text-slate-400">
                  Update classification label associated with ID #{id}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(categoryDataDetail?.id)}
              disabled={isLoading || statusDetail === 'loading'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 text-xs font-semibold transition-colors"
              title="Delete this category"
            >
              <FiTrash2 className="text-xs" />
              <span>Delete</span>
            </button>
          </div>

          {/* Status Loading */}
          {statusDetail === 'loading' ? (
            <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <FiClock className="animate-spin text-sm" />
              Loading category data...
            </div>
          ) : (
            <>
              {/* Errors */}
              {(formError || error) && (
                <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
                  <FiAlertCircle className="text-base shrink-0" />
                  <span>{formError || error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category ID
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      value={id || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 bg-slate-100/70 text-slate-500 text-sm font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

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
                      name='name'
                      type="text"
                      placeholder="e.g. cate 11"
                      value={form.name}
                      onChange={handleOnChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                      autoFocus
                    />
                  </div>
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
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
                  >
                    <FiSave className="text-sm" />
                    {isLoading ? 'Updating...' : 'Update Category'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <FiInfo className="text-base text-slate-500" />
            <span>Metadata & Payload</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiCalendar className="text-slate-400" />
              <span>Created Timestamp</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {formatDate(categoryDataDetail?.createdAt)}
            </div>
          </div>

          {/* Backend Put Payload Preview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PUT Payload (`/categories/{id}`)
            </span>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
              {JSON.stringify({ name: form.name || categoryDataDetail?.name || "cate 11" }, null, 2)}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}

export default UpdateCategory