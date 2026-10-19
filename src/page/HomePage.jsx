import { useState } from 'react';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiPlus, 
  FiMoreVertical, 
  FiSliders, 
  FiCalendar, 
  FiUser, 
  FiCreditCard,
  FiFilter
} from 'react-icons/fi';
import { 
  BsGridFill, 
  BsWallet2, 
  BsPiggyBank, 
  BsThreeDots 
} from 'react-icons/bs';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';

const HomePage = () => {

  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="w-full md:px-10 px-5 md:py-8 py-4 space-y-6 max-w-360 mx-auto text-slate-800">
      
      <div className="w-full bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"> 

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Consolidated Net Assets
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active Vault
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              $133,000.00
            </h1>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <FiArrowUpRight className="text-base" />
              +18.4%
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400">
            Across 2 linked primary liquid accounts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 border-y xl:border-y-0 xl:border-x border-slate-100 py-4 xl:py-0 xl:px-8 w-full xl:w-auto">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Inflow
            </div>
            <div className="text-lg font-bold text-emerald-600 mt-1">
              +$5,000.00
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Scheduled Oct 04, 2026
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Allocations
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              02 Accounts
            </div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
              Cash • Savings
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition-all">
            <FiArrowUpRight className="text-base" />
            New Expense
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition-all">
            <FiArrowDownLeft className="text-base" />
            New Income
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all">
            <HiOutlineBuildingLibrary className="text-base" />
            + New Account
          </button>
        </div>
      </div>

      <div className="flex-1 gap-2">
        <div className="flex items-center gap-2 md:p-3 p-2 bg-white rounded-xl shadow-xs border border-slate-100 text-xs font-semibold text-slate-700">
          <span className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            ⚡
          </span>
          Expense Tracker
          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-normal">
            FinFlow
          </span>
        </div>
      </div>

      {/* main grid*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left side */}
        <div className="lg:col-span-3 space-y-6">
          {/* account */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">
              <span>Account Filters</span>
              <FiSliders className="text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>

            <button 
              onClick={() => setSelectedFilter('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BsGridFill className="text-sm opacity-80" />
                <span>All Accounts</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                selectedFilter === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}>
                2
              </span>
            </button>

            <button 
              onClick={() => setSelectedFilter('cash')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === 'cash'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BsWallet2 className="text-sm opacity-80" />
                <span>Cash Accounts</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                selectedFilter === 'cash' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}>
                1
              </span>
            </button>

            <button 
              onClick={() => setSelectedFilter('savings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedFilter === 'savings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BsPiggyBank className="text-sm opacity-80" />
                <span>Savings Accounts</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                selectedFilter === 'savings' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
              }`}>
                1
              </span>
            </button>
          </div>

          {/* categories */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                Categories
              </span>
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <FiPlus className="text-sm" /> Add
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-700">cate 11</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">1 tx</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="font-medium text-slate-700">Travel & Flights</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">1 tx</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span className="font-medium text-slate-700">Family Provisions</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">1 tx</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="font-medium text-slate-700">Housing & Nest</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">1 tx</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Asset Distribution
              </span>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-1">
                <span>Future Family <span className="font-normal text-slate-400 block text-[11px]">79.7%</span></span>
                <span className="text-right">Travel Fund <span className="font-normal text-slate-400 block text-[11px]">20.3%</span></span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="h-full bg-slate-900 rounded-l-full" style={{ width: '79.7%' }}></div>
                <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: '20.3%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle side */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FiArrowDownLeft className="text-lg" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Income Tracker</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  1 record
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg">
                  Overview
                </button>
                <button className="text-xs font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  Feed
                </button>
              </div>
            </div>

            {/* Income Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Income Card 1 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-3 pl-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      <FiArrowDownLeft className="text-xs" /> Inflow
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <FiMoreVertical className="text-sm" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base mb-1 pl-1">
                    Saving for future wife
                  </h3>
                  <div className="text-2xl font-black text-emerald-600 pl-1 mb-4">
                    +$5,000.00
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 pl-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <BsWallet2 className="text-[11px] text-slate-400" />
                      Future Family
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      CASH
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium ml-auto">
                      <FiUser className="text-[11px] text-slate-400" />
                      hengthay
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                      cate 11
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      Oct 04, 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Income Card 2 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <FiCalendar className="text-xs" /> Scheduled Deposit
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <FiMoreVertical className="text-sm" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base mb-1">
                    Bi-weekly Retainer
                  </h3>
                  <div className="text-2xl font-black text-slate-800 mb-4">
                    +$3,250.00
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <BsPiggyBank className="text-[11px] text-slate-400" />
                      Travel Fund
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      SAVINGS
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium ml-auto">
                      <FiUser className="text-[11px] text-slate-400" />
                      pachie
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                      Retainer
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      Oct 15, 2026
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <FiArrowUpRight className="text-lg" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Expense Tracker</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  2 pending tx
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <FiFilter className="text-sm" />
              </button>
            </div>

            {/* Expense Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Expense Card 1 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-3 pl-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <FiArrowUpRight className="text-xs" /> Outflow
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <FiMoreVertical className="text-sm" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base mb-1 pl-1 line-clamp-1">
                    International Flights (KIX)
                  </h3>
                  <div className="text-2xl font-black text-rose-600 pl-1 mb-4">
                    -$1,480.00
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 pl-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <BsPiggyBank className="text-[11px] text-slate-400" />
                      Travel Fund
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      SAVINGS
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium ml-auto">
                      <FiUser className="text-[11px] text-slate-400" />
                      pachie
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-semibold text-[11px]">
                      Travel & Flights
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      Oct 02, 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Expense Card 2 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600">
                      <FiArrowUpRight className="text-xs" /> Outflow
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <FiMoreVertical className="text-sm" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-base mb-1 line-clamp-1">
                    Home Furnishing Reserve
                  </h3>
                  <div className="text-2xl font-black text-slate-800 mb-4">
                    -$850.00
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <BsWallet2 className="text-[11px] text-slate-400" />
                      Future Family
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      CASH
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium ml-auto">
                      <FiUser className="text-[11px] text-slate-400" />
                      hengthay
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                      cate 11
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      Sep 30, 2026
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiOutlineBuildingLibrary className="text-slate-700 text-lg" />
              <h2 className="text-lg font-bold text-slate-900">Accounts</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              2 ACTIVE
            </span>
          </div>

          {/* Account Card 1 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg">
                  <FiCreditCard />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Future Family</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-600 text-[9px]">
                      CASH
                    </span>
                    <span>Created Oct 02, 2026</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <BsThreeDots className="text-base" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Current Balance
              </span>
              <div className="text-2xl font-black text-emerald-600">
                $106,000.00
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Owner: <span className="font-semibold text-slate-700">hengthay</span>
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>

          {/* Account Card 2 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <RiExchangeDollarLine />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Travel Fund</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-600 text-[9px]">
                      SAVINGS
                    </span>
                    <span>Created Sep 29, 2026</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <BsThreeDots className="text-base" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Current Balance
              </span>
              <div className="text-2xl font-black text-emerald-600">
                $27,000.00
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Owner: <span className="font-semibold text-slate-700">pachie</span>
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                USER
              </span>
            </div>
          </div>

          {/* Add Account Dotted Button */}
          <button className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <FiPlus className="text-base text-emerald-600" />
            Link or Add New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;