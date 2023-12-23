"use client";
import Link from "next/link";
import React, { useState } from "react";
import { CiMenuBurger, CiViewList } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdClose, MdPersonAddAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbHomeCheck } from "react-icons/tb";
import SignOutBtn from "./SignOutBtn";
const NavbarLink = ({ href, onClick, icon, text }: any) => (
  <li className="h-10 bg-slate-500 flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
    <Link
      onClick={onClick}
      href={href}
      className="flex flex-row items-center justify-center w-full h-full"
    >
      {icon && <span className="text-[20px] mr-2">{icon}</span>}
      {text}
    </Link>
  </li>
);

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
      {!closeNav && (
        <div className="flex flex-col absolute w-full h-full bg-gray-950 opacity-90 top-0 bottom-0 left-0 right-0 z-50">
          {/* Close Button */}
          <div className="w-full h-14 pl-10 pr-8 py-3 flex justify-end items-center">
            <div className="bg-gray-700 rounded-lg">
              <MdClose className="scale-150 m-2" onClick={handleClose} />
            </div>
          </div>
          {/* Links */}
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ul className="w-full flex flex-col justify-center items-center">
              {navLinks.map((link, index) => (
                <NavbarLink key={index} {...link} onClick={handleClose} />
              ))}
            </ul>
            {/* <SignOutBtn /> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
