import { handleLogOut } from "@/actions/action";
import { signOut } from "@/auth";
import React from "react";
import { CgLogOut } from "react-icons/cg";

const SignOutBtn = () => {
  return (
    <ul className="absolute flex justify-center items-center bottom-10 w-full">
      <form
        action={handleLogOut}
        className="flex flex-row items-center justify-center w-36 h-14 justify-left my-1 rounded-xl bg-gray-900 hover:bg-gray-700"
      >
        <button className="flex grow w-full items-center justify-center rounded-md text-sm font-medium md:flex-none md:justify-center md:p-2 md:px-3">
          <CgLogOut className="text-[20px] mr-2 font-bold" />
          <div className="hidden md:block font-bold">Sign Out</div>
        </button>
      </form>
    </ul>
  );
};

export default SignOutBtn;
