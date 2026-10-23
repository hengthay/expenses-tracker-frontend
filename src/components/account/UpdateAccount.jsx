import { useEffect, useState } from "react";
import {
  fetchByAccountId,
  resetAccountStatus,
  selectAccountDataDetail,
  selectAccountErrorDetail,
  selectAccountStatusDetail,
  updateAccount,
} from "../../feature/accounts/accountSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiDollarSign,
  FiInfo,
  FiPlus,
  FiTag,
} from "react-icons/fi";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import Swal from "sweetalert2";

const UpdateAccount = () => {
  const { id } = useParams();
  console.log("Account ID: ", id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Account Redux State Data
  const accountDetail = useSelector(selectAccountDataDetail);
  const accountDetailStatus = useSelector(selectAccountStatusDetail);
  const accountDetailError = useSelector(selectAccountErrorDetail);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError("");
  };

  // Fetch Account before updating
  useEffect(() => {
    if (id) dispatch(fetchByAccountId(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!accountDetail) return;

    setFormData({
      name: accountDetail?.name ?? "",
      type: accountDetail?.type ?? "",
    });
  }, [accountDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.name.trim()) {
        setFormError("Account name is required.");
        return;
      }

      if (!formData.type) {
        setFormError("Account type is required.");
        return;
      }

      setFormError("");

      const payload = {
        name: formData.name.trim(),
        type: formData.type,
      };

      await dispatch(updateAccount({ id, payload })).unwrap();

      dispatch(resetAccountStatus());

      Swal.fire({
        title: "Successfully",
        text: "Account updated",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate("/accounts");
      }, 2000);

      // Clear form
      setFormData({
        name: "",
        type: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Error to update account",
        icon: "error",
        timer: 2000,
      });
    } finally {
      setFormData({
        name: "",
        type: "",
      });
      setIsLoading(false);
      setFormError(null);
    }
  };

  return (
    <div className="w-full max-w-360 mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      <div className="flex items-center gap-3">
        <Link
          to="/accounts"
          className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
        >
          <FiArrowLeft className="text-base" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Treasury & Accounts</span>
            <span>/</span>
            <span className="text-slate-600">New Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Open New Account
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
              <h2 className="text-base font-bold text-slate-900">
                Vault Information
              </h2>
              <p className="text-xs text-slate-400">
                Configure your liquid vault ledger details and opening capital
                balance.
              </p>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Account Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. New Monitor"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                id="type"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Account Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white"
                >
                  <option value="">Select Account Type</option>
                  <option value="CHECKING">Checking</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                  <option value="INVESTMENT">Investment</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                id="type"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Account Balance
              </label>
              <div className="disabled:read-only w-full flex items-center pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all bg-slate-50/50 focus:bg-white">
                {accountDetail?.balance?.toFixed(2)} 
                <FiDollarSign />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/accounts"
                className="w-full sm:w-auto px-5 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all"
              >
                <FiPlus className="text-sm" />
                {isLoading ? "Updating Account..." : "Save Account"}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <FiInfo className="text-base text-slate-500" />
            <span>Payload & Live Preview</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Card Preview
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-800">
                {formData.type}
              </span>
            </div>
            <div className="font-bold text-slate-900 text-base">
              {formData.name.trim() || "Account Title Preview"}
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              $
              {parseFloat(accountDetail?.balance || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PUT `/accounts` Payload
            </span>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
              {JSON.stringify(
                {
                  name: formData.name.trim() || "New Monitor",
                  type: formData.type,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccount;
