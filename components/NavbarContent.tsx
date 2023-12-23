import Link from "next/link";
import { navLinks } from "./navbar";
import { MdClose } from "react-icons/md";
import SignOutBtn from "./SignOutBtn";

interface NavbarContentProps {
  handleClose: () => void;
}

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
const NavbarContent = ({ handleClose }: NavbarContentProps) => {
  return (
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
        <SignOutBtn />
      </div>
    </div>
  );
};

export default NavbarContent;
