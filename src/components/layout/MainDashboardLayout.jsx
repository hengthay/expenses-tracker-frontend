import React, { useState } from 'react'
import NavBar from '../NavBar';
import SideBar from '../SideBar';
import { Outlet } from 'react-router-dom';

const MainDashboardLayout = () => {

  const [isOpen, setIsOpen] = useState(true);

  const handleOpenMenu = () => [setIsOpen((prev) => !prev)];

  return (
    <div className="flex min-h-screen h-auto w-full">
      {/* Sidebar */}
      <SideBar isOpen={isOpen} onClose={handleOpenMenu}/>
      <div className={`w-full transition-all ease-in-out duration-300 ${isOpen ? "pl-60" : "pl-20"}`}>
        {/* Navbar */}
        <NavBar sideBarOpen={isOpen} onToggle={handleOpenMenu}/>
        <main className="flex-1 min-h-screen overflow-y-auto pt-20 px-2">
          <Outlet 
            context={{ isOpen }}
          />
        </main>
      </div>
    </div>
  )
}

export default MainDashboardLayout