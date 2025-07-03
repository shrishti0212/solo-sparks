import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../utils/userSlice";
import logo from "../images/logo.png";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    setIsOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-[#5f5796] font-semibold border-b-2 border-[#5f5796] pb-1"
      : "text-gray-600 hover:text-[#5f5796] transition";

  const navLinks = (
    <>
      <NavLink to="/home" onClick={() => setIsOpen(false)} className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/rewards" onClick={() => setIsOpen(false)} className={navLinkClass}>
        Rewards
      </NavLink>
      <NavLink to="/profile" onClick={() => setIsOpen(false)} className={navLinkClass}>
        Profile
      </NavLink>
      {currentUser ? (
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1.5 bg-[#8576FF] text-white rounded-md hover:bg-[#6f60db] transition text-sm"
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          onClick={() => setIsOpen(false)}
          className="ml-2 px-4 py-1.5 bg-[#8576FF] text-white rounded-md hover:bg-[#6f60db] transition text-sm"
        >
          Login
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="w-full bg-white text-gray-800 px-4 sm:px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16">
        <div>
          <img src={logo} alt="Logo" className="h-14 w-auto object-contain" />
        </div>
        <div className="hidden sm:flex gap-6 items-center text-sm sm:text-base font-medium">
          {navLinks}
        </div>
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(true)}>
            <HiOutlineMenu className="text-3xl text-[#5f5796]" />
          </button>
        </div>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 sm:hidden">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            <button onClick={() => setIsOpen(false)}>
              <HiOutlineX className="text-2xl text-gray-700" />
            </button>
          </div>
          <div className="flex flex-col gap-4 text-base font-medium">
            {navLinks}
          </div>
        </div>
      </Dialog>
    </nav>
  );
};

export default Navbar;
