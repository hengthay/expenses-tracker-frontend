import { CiTrash } from "react-icons/ci";
import { FiCalendar, FiChevronRight, FiEdit2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../helper/formatDate";
import { BsFolderCheck } from "react-icons/bs";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { deleteCategory, resetCategoryStatus } from "../../feature/categories/categorySlice";

const CategoryCard = ({ cat }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <tr
      key={cat?.id}
      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
      onClick={() => navigate(`/categories/${cat?.id}`)}
    >
      <td className="py-4 px-3">
        <span className="font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
          #{cat?.id}
        </span>
      </td>

      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-semibold shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <BsFolderCheck />
          </div>
          <span className="font-bold text-slate-900 text-sm">{cat?.name}</span>
        </div>
      </td>

      <td className="py-4 px-3">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <FiCalendar className="text-slate-400 text-xs" />
          <span>{formatDate(cat?.createdAt)}</span>
        </div>
      </td>

      <td
        className="py-4 px-3 text-right"
        onClick={(e) => e.stopPropagation()} // Prevent row click collision
      >
        <div className="inline-flex items-center gap-1.5">
          <Link
            to={`/categories/edit/${cat?.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-[11px] font-medium"
            title="Edit Category in separate page"
          >
            <FiEdit2 className="text-xs" />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(cat?.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-[11px] font-medium"
            title="Edit Category in separate page"
          >
            <CiTrash className="text-xs" />
            <span>Remove</span>
          </button>

          <Link
            to={`/categories/${cat?.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="View Details"
          >
            <FiChevronRight className="text-sm" />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default CategoryCard;
