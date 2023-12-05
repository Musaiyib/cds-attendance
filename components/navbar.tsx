"use client";
import Link from "next/link";
import React, { useState } from "react";
import { CgLogOut } from "react-icons/cg";
import { CiMenuBurger, CiViewList } from "react-icons/ci";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdClose, MdPersonAddAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbHomeCheck } from "react-icons/tb";

const Navbar = () => {
  const [closeNav, setCloseNav] = useState<boolean>(true);

  const handleClose = () => {
    setCloseNav(!closeNav);
  };
  return (
    <nav className="flex flex-wrap w-full justify-between items-center px-10 py3 bg-gray-800 h-14 lg:hidden">
      <div className="w-1/2 flex justify-start">Logo</div>
      <div className="w-1/2 flex justify-end">
        <CiMenuBurger
          onClick={handleClose}
          className={`scale-150 ${closeNav ? "block" : "hidden"}`}
        />
      </div>
      {!closeNav && (
        <div className="flex flex-col absolute w-full h-full bg-gray-950 opacity-90 top-0 bottom-0 left-0 right-0 z-50">
          <div className="w-full h-14 pl-10 pr-8 py-3 flex justify-end items-center">
            <div className="bg-gray-700 rounded-lg">
              <MdClose className="scale-150 m-2" onClick={handleClose} />
            </div>
          </div>
          {/* links */}
          <div className="w-full h-full flex flex-col justify-center items-center">
            <ul className="w-full flex flex-col justify-center items-center">
              <li className="h-10 bg-slate-500 flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/dashboard"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <RxDashboard className="text-[20px] mr-2" />
                  Dashboard
                </Link>
              </li>
              <li className="h-10 flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/dashboard/cds"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <TbHomeCheck className="text-[20px] mr-2" />
                  CDS Groups
                </Link>
              </li>
              <li className="h-10  flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/dashboard/attendance/mark"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <IoCheckmarkDone className="text-[20px] mr-2" />
                  Mark Attendance
                </Link>
              </li>
              <li className="h-10  flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/dashboard/attendance/view"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <CiViewList className="text-[20px] mr-2" />
                  View Attendance
                </Link>
              </li>
              <li className="h-10  flex items-center justify-center my-2 w-56 rounded-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/dashboard/add"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <MdPersonAddAlt className="text-[20px] mr-2" />
                  Add Corp Member
                </Link>
              </li>
            </ul>
            <ul className="absolute bottom-5 w-full">
              <li className="h-10  flex items-center justify-center my-1 rounded-r-3xl hover:bg-gray-700">
                <Link
                  onClick={handleClose}
                  href="/logout"
                  className="flex flex-row items-center justify-center w-full h-full"
                >
                  <CgLogOut className="text-[20px] mr-2" /> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
