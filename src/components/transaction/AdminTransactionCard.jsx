import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { formatDate } from "../helper/formatDate";

const AdminTransactionCard = ({ tx, isIncome, owner }) => {
  return (
    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
      <td className="py-3.5 px-3">
        <span className="font-bold text-slate-800 block">
          {formatDate(tx.transactionDate || tx.createdAt)}
        </span>
        <span
          className="font-mono text-[10px] text-slate-400 block truncate max-w-30"
          title={tx.id}
        >
          {tx.id ? `${tx.id.substring(0, 8)}...` : "—"}
        </span>
      </td>

      <td className="py-3.5 px-3">
        <span className="font-bold text-slate-900 block">
          {tx.notes || "Unspecified"}
        </span>
        <span className="text-[10px] text-slate-400">
          Created: {tx?.createdAt ? formatDate(tx.createdAt) : "Unknown"}
        </span>
      </td>

      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-800">
            {tx.account?.name || "Unassigned"}
          </span>
          {tx.account?.type && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
              {tx.account.type}
            </span>
          )}
        </div>
      </td>

      <td className="py-3.5 px-3">
        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
          {tx.category?.name || "Uncategorized"}
        </span>
      </td>

      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
          <span className="font-bold text-slate-800">
            {owner?.username || "—"}
          </span>
          {owner?.role && (
            <span className="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-500">
              {owner.role}
            </span>
          )}
        </div>
      </td>

      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase ${
            isIncome
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isIncome ? (
            <FiArrowDownLeft className="text-xs" />
          ) : (
            <FiArrowUpRight className="text-xs" />
          )}
          {tx.type}
        </span>
      </td>

      <td
        className={`py-3.5 px-3 text-right font-black text-sm ${isIncome ? "text-emerald-600" : "text-slate-900"}`}
      >
        {isIncome ? "+" : "-"}$
        {Number(tx.amount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </td>
    </tr>
  );
};

export default AdminTransactionCard;
