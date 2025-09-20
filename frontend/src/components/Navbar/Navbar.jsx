import { NavLink } from "react-router-dom";
import TomeshelfLogo from "../../assets/TomeshelfLogo 1.png";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiOutlineSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useOutsideClick(profileRef, () => setIsProfileOpen(false));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropDownRef = useRef(null)
  useOutsideClick(dropDownRef, () => setIsMobileMenuOpen(false))


  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "text-[#3498DB] font-medium" : "text-[#2C3E50]"
    } hover:text-[#3498DB] hover:bg-[#ECF0F1]`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ECF0F1] shadow-md">
      <nav className="container mx-auto flex h-[60px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-10">
          <NavLink to="/">
            <img src={TomeshelfLogo} alt="Tomeshelf Logo" className="h-[28px]" />
          </NavLink>

          <div className="relative hidden md:flex">
            <input
              type="search"
              placeholder="Search for books..."
              className="h-8 w-64 rounded-lg border border-[#BDC3C7] bg-white px-3 pr-8 text-sm outline-none placeholder:text-[#BDC3C7] focus:border-[#3498DB]"
            />
            <HiOutlineSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BDC3C7]" />
          </div>
        </div>

          

        {/* Center: Nav links + Search (desktop only) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex gap-3">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/genres" className={navLinkClasses}>Genres</NavLink>
            <NavLink to="/category" className={navLinkClasses}>Category</NavLink>
          </div>
        
        </div>

        {/* Right: Profile + Mobile menu */}
        <div className="flex items-center gap-4" ref={dropDownRef}>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-[#BDC3C7]/50 hover:bg-[#BDC3C7]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <HiMenu className="h-6 w-6 text-[#2C3E50]" />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BDC3C7]/50 text-[#2C3E50] transition-colors duration-200 hover:bg-[#BDC3C7]"
            >
              <CgProfile className="h-6 w-6" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-44 rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200">
                <ul className="flex flex-col text-sm text-[#2C3E50]">
                  <li>
                    <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className={navLinkClasses}>Register</NavLink>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white shadow-lg border-t border-gray-200 flex flex-col animate-slide-down">
          <div className="p-4">
            <input
              type="search"
              placeholder="Search for books..."
              className="w-full h-10 rounded-lg border border-[#BDC3C7] px-4 text-sm outline-none placeholder:text-[#BDC3C7] focus:border-[#3498DB]"
            />
          </div>
          <NavLink to="/" className={navLinkClasses}>Home</NavLink>
          <NavLink to="/genres" className={navLinkClasses}>Genres</NavLink>
          <NavLink to="/category" className={navLinkClasses}>Category</NavLink>
        
        </div>
      )}
    </header>
  );
};

export default Navbar;
