import Link from "next/link";
import { CgLogOut } from "react-icons/cg";
import { MdPersonAddAlt } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import { TbHomeCheck } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";

const SideBar = () => {
  return (
    <section className="min-w-max bg-gray-800 h-full hidden lg:flex">
      <div className="w-[280px] h-full flex flex-col items-left relative">
        <div className="flex flex-col justify-center items-center mt-14 mb-10">
          <div className="w-16 h-16 rounded-full bg-slate-600 mb-4 mt-4"></div>
          <h3>Musaiyib Yakubu Usman</h3>
          <p>CDs Group</p>
          <p>Admin</p>
        </div>
        <div className="pr-6">
          <ul className="my-14">
            <li className="h-10 bg-slate-500 flex items-center justify-left pl-4 my-2 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/dashboard"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <RxDashboard className="text-[20px] mr-2" />
                Dashboard
              </Link>
            </li>
            <li className="h-10 flex items-center justify-left pl-4 my-2 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/dashboard/cds"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <TbHomeCheck className="text-[20px] mr-2" />
                CDS Groups
              </Link>
            </li>
            <li className="h-10  flex items-center justify-left pl-4 my-2 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/dashboard/attendance/mark"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <IoCheckmarkDone className="text-[20px] mr-2" />
                Mark Attendance
              </Link>
            </li>
            <li className="h-10  flex items-center justify-left pl-4 my-2 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/dashboard/attendance/view"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <CiViewList className="text-[20px] mr-2" />
                View Attendance
              </Link>
            </li>
            <li className="h-10  flex items-center justify-left pl-4 my-2 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/dashboard/add"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <MdPersonAddAlt className="text-[20px] mr-2" />
                Add Corp Member
              </Link>
            </li>
          </ul>
          <ul className="absolute bottom-5 w-full pr-6">
            <li className="h-10  flex items-center justify-left pl-4 my-1 rounded-r-3xl hover:bg-gray-700">
              <Link
                href="/logout"
                className="flex flex-row items-center justify-left w-full h-full"
              >
                <CgLogOut className="text-[20px] mr-2" /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SideBar;
