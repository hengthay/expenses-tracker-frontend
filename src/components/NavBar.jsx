import { BsPlusCircleDotted } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { TbTransactionDollar } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const NavBar = ({ sideBarOpen, onToggle }) => {

  const userRole = 'ADMIN';

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white border-b border-gray-200
      transition-all duration-300 shadow
      ${sideBarOpen ? "left-60" : "left-18"}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">

        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <GiHamburgerMenu size={22} />
          </button>
        </div>

        <div
          className={`hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 ${sideBarOpen ? "w-100" : "w-160"}`}
        >
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-2 py-1.5 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className='md:flex hidden gap-2'>
            <Link
              className='flex justify-center items-center md:gap-1.5 gap-1 text-xs text-black hover:bg-slate-200 bg-slate-100 transition-all ease-in-out duration-200 p-2 rounded-md font-medium'
              to={'/accounts/create'}
            >
              <BsPlusCircleDotted size={14}/>
              Add Account
            </Link>
            <Link
              className='flex justify-center items-center md:gap-1.5 gap-1 text-xs text-white hover:bg-black/50 bg-black transition-all ease-in-out duration-200 p-2 rounded-md font-medium'
              to={'/transactions/create'}
            >
              <TbTransactionDollar size={14}/>
              New Transaction
            </Link>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md">
            <img
              src="https://picsum.photos/200/300"
              alt="profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
            />
            <div className="hidden md:block leading-tight">
              <h4 className="font-semibold text-[14px] text-black">Admin</h4>
              <p className="text-xs text-gray-700">
                {
                  userRole === "admin"
                    ? "Administrator"
                    : "USER"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar