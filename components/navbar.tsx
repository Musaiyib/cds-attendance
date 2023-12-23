"use client";
import React, { useState } from "react";
import { CiMenuBurger, CiViewList } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdPersonAddAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbHomeCheck } from "react-icons/tb";
import NavbarContent from "./NavbarContent";

export const navLinks = [
  { href: "/dashboard", text: "Dashboard", icon: <RxDashboard /> },
  { href: "/dashboard/cds", text: "CDS Groups", icon: <TbHomeCheck /> },
  {
    href: "/dashboard/attendance/mark",
    text: "Mark Attendance",
    icon: <IoCheckmarkDone />,
  },
  {
    href: "/dashboard/attendance/view",
    text: "View Attendance",
    icon: <CiViewList />,
  },
  { href: "/dashboard/add", text: "Add Corp Member", icon: <MdPersonAddAlt /> },
];
const Navbar = () => {
  const [closeNav, setCloseNav] = useState<boolean>(true);

  const handleClose = () => {
    setCloseNav(!closeNav);
  };
  return (
    <nav className="flex flex-wrap w-full justify-between items-center px-10 py3 bg-gray-800 h-14 lg:hidden">
      {/* Logo */}
      <div className="w-1/2 flex justify-start">Logo</div>
      {/* Menu Icon */}
      <div className="w-1/2 flex justify-end">
        <CiMenuBurger
          onClick={handleClose}
          className={`scale-150 ${closeNav ? "block" : "hidden"}`}
        />
      </div>
      {/* Navigation Links */}
      {!closeNav && <NavbarContent handleClose={handleClose} />}
    </nav>
  );
};

export default Navbar;
