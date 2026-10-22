import { useEffect, useMemo, useState } from 'react'
import { GrTransaction } from 'react-icons/gr';
import { LuUsersRound } from 'react-icons/lu';
import { MdDashboard, MdOutlineAccountBalance, MdOutlineCategory, MdOutlineTrackChanges } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { forceLogout, getCurrentUser, selectRoleAdmin } from '../feature/auth/authSlice';
import { FiLogOut } from 'react-icons/fi';
import { RiExpandUpDownLine } from 'react-icons/ri';

const SideBar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();

  const handleToggleLogout = () => setShowLogout(prev => !prev);

  useEffect(() => {
    if (!isOpen) {
      setShowLogout(false);
    }
  }, [isOpen]);

  // Fetch current users to get role
  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  const userRole = useSelector(selectRoleAdmin);

  const menuLists = [
    {
      id: 1,
      iconName: MdDashboard,
      label: "Dashboard",
      pathName: "/dashboard",
      roles: ["ADMIN", "USER"],
    },
    {
      id: 2,
      iconName: GrTransaction,
      label: "Transactions",
      pathName: "/transactions",
      roles: ["ADMIN", "USER"],
    },
    {
      id: 3,
      iconName: MdOutlineAccountBalance,
      label: "Accounts & Wallets",
      pathName: "/accounts",
      roles: ["ADMIN", "USER"],
    },
    {
      id: 4,
      iconName: MdOutlineCategory,
      label: "Categories",
      pathName: "/categories",
      roles: ["ADMIN"],
    },
    {
      id: 5,
      iconName: LuUsersRound,
      label: "User Management",
      pathName: "/users",
      roles: ["ADMIN", "USER"],
    },
  ];

   const handleLogout = async () => {
    try {

      dispatch(forceLogout());

      Swal.fire({
        title: "Successfully",
        text: "Your logout is successfully!",
        icon: 'success',
        timer: 2000,
      });

      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Failed",
        text: "Your logout is failed!",
        icon: 'error',
        timer: 1000,
      });
    }
  };

  const year = useMemo(() => new Date().getFullYear());

  const renderNavLinks = (items) => {
    return items
      .filter((item) => item.roles.includes(userRole))
      .map((item) => {
      const Icon = item.iconName;
      const isActive = location.pathname === item.pathName;

      return (
        <li key={item.id}>
          <Link
            to={item.pathName}
            className={`group relative flex items-center ${
              isOpen ? "justify-start gap-3 px-3" : "justify-center"
            } py-2.5 rounded-sm transition-all duration-200
              ${
                isActive
                  ? "bg-slate-200 text-black font-medium"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }
            `}
          >
            {isActive && (
              <div className="absolute left-0 top-0 bottom-2 w-1 h-full rounded-r-full bg-black/50" />
            )}

            <Icon
              size={15}
              className={`min-w-4.5 ${isActive ? "text-black" : ""}`}
            />

            <span
              className={`whitespace-nowrap transition-all duration-200 text-sm
                ${
                  isOpen
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }
              `}
            >
              {item.label}
            </span>

            {!isOpen && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50"
              >
                {item.label}
              </div>
            )}
          </Link>
        </li>
      );
    });
  };
  
  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-20 min-h-screen bg-mist-100 shadow 
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-60" : "w-18"}`}
      >
        <div className={`flex flex-col p-3 md:p-4 md:space-y-6 space-y-4 h-screen ${!isOpen ? "justify-center items-center" : "justify-start"}`}>
          <div className='space-y-6 w-full'>
            <div
              className={`flex items-center gap-3 ${
                isOpen ? "justify-start" : "justify-center"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg">
                <MdOutlineTrackChanges size={24}/>
              </div>

              {isOpen && (
                <div className="opacity-100 transition-opacity duration-200">
                  <h1 className="text-black font-semibold text-lg">
                    FinFlow
                  </h1>
                  <p className="text-slate-600 text-xs">
                    Financial Tracking
                  </p>
                </div>
              )}
            </div>
            
            {isOpen && <hr className='text-gray-300' />}
            {/* Menu */}
            <div className="md:space-y-6 space-y-2">
              <div>
                {isOpen && (
                  <p className="uppercase tracking-[0.15em] text-xs font-semibold text-slate-700 px-3 mb-2">
                    General
                  </p>
                )}
                <ul className="space-y-1">
                  {
                    renderNavLinks(menuLists)
                  }
                </ul>
              </div>
            </div>
          </div>
          
          <div className='h-full w-full flex items-end justify-start'>
            <div className="flex relative justify-between items-center w-full shadow-sm bg-white rounded-lg p-1.5">
              {isOpen && (
                <div className='flex gap-x-2 gap-y-1 text-sm'>
                  <img
                    src="https://picsum.photos/200/300"
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
                  />
                  <div className="transition-all duration-300 origin-left opacity-100 scale-100">
                    <h4 className="font-semibold">Admin</h4>
                    <p className="text-xs text-gray-500">
                      {
                      userRole === "ADMIN"
                        ? "Administrator"
                        : "USER"
                      }
                    </p>
                  </div>
                </div>
              )}
              
              <div onClick={handleToggleLogout} className='cursor-pointer p-1'>
                <RiExpandUpDownLine />
              </div>

              {showLogout && (
                <div className={`absolute w-full bg-white p-2 rounded-lg shadow-md z-50 space-y-2 ${isOpen ? '-top-13 -right-47' : '-top-25 -right-50 min-w-50'}`}>
                  {!isOpen && (
                    <div className='flex items-center gap-x-2 gap-y-1'>
                      <img
                          src="https://picsum.photos/200/300"
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
                        />
                      <div className="transition-all duration-300 origin-left">
                        <h4 className="font-semibold">Admin</h4>
                        <p className="text-xs text-gray-500">
                          {userRole === "ADMIN"
                            ? "Administrator"
                            : "USER"
                            }
                        </p>
                      </div>
                    </div>
                  )}
                  <hr className='text-gray-500' />
                  <button
                    onClick={handleLogout}
                    className={`flex justify-start items-center gap-2 bg-black cursor-pointer text-white
                    ${isOpen ? "px-4" : "px-3"} py-1.5 rounded-md border
                    hover:bg-transparent hover:text-black group transition w-full`}
                  >
                    <FiLogOut size={18} className="text-white group-hover:text-black" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {isOpen && (
            <p className="text-[10.5px] text-slate-500 text-center opacity-100">&copy;{year} Expense Tracker.</p>
          )}
        </div>
      </aside>
    </>
  );
}

export default SideBar