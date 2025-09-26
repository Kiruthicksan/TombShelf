import { NavLink } from "react-router-dom";
import TomeshelfLogo from "../assets/TomeshelfLogo 1.png";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiOutlineSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "./hooks/useOutsideClick";
import { useAuthStore } from "../store/store";
import { ShoppingCart } from "lucide-react";
import ProfileMenuOpen from "./ProfileMenuOpen";
import MobileMenuOpen from "./MobileMenuOpen";

const Navbar = () => {
  //--------------------- auth store (global)-----------------------------------

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const logout = useAuthStore((state) => state.logout);

  // ---------------------  local states --------------------------

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ---------------------- Refs for outside link-------------------------------

  const profileRef = useRef(null);
  const dropDownRef = useRef(null);

  useOutsideClick(profileRef, () => setIsProfileOpen(false));
  useOutsideClick(dropDownRef, () => setIsMobileMenuOpen(false));

  //  ------------------ globalized main navlink for styling ----------------------------------
  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "text-[#3498DB] font-medium" : "text-[#2C3E50]"
    } hover:text-[#3498DB] hover:bg-[#ECF0F1]`;

  //------------------- logic for handling logout ---------------------------------------------------

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ----------helper function to close profile menu automatically-------------------------------------
  const handleCloseProfile = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-md bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-[60px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ----------------------Left: Logo ------------------------------------------------------*/}
        <div className="flex items-center gap-10">
          <NavLink to="/">
            <img
              src={TomeshelfLogo}
              alt="Tomeshelf Logo"
              className="h-[28px]"
            />
          </NavLink>

          {/* ------------------------------- Desktop search -------------------------------------------------- */}
          <div className="relative hidden md:flex">
            <input
              type="search"
              placeholder="Search for books..."
              className="h-8 w-64 rounded-lg border border-[#BDC3C7] bg-white px-3 pr-8 text-sm outline-none placeholder:text-[#BDC3C7] focus:border-[#3498DB]"
            />
            <HiOutlineSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BDC3C7]" />
          </div>
        </div>

        {/* --------------------------Center: Nav links + Search (desktop only) -------------------*/}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/genres" className={navLinkClasses}>
              Genres
            </NavLink>

            {/* ................ Manage Books page for admin  ----------------------------- */}

            {isAuthenticated && isAdmin && (
              <>
                <NavLink to="/manage-books" className={navLinkClasses}>
                  Manage Books
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* ---------------------------Right-Section: Cart +  Profile + Mobile menu ---------------------------*/}
        <div className="flex items-center gap-4" ref={dropDownRef}>
          {/* -------------------Mobile Hamburger------------------------------------- */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-[#BDC3C7]/50 hover:bg-[#BDC3C7]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <HiMenu className="h-6 w-6 text-[#2C3E50]" />
          </button>

          {/* ------------ Cart Icon -----------------------------*/}

          <div className="relative  gap-5 flex items-center" ref={profileRef}>
            {isAuthenticated && (
              <div className="relative">
                <ShoppingCart />
              </div>
            )}

            {/* ---------------Profile icon ------------------------------ */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BDC3C7]/50 text-[#2C3E50] transition-colors duration-200 hover:bg-[#BDC3C7]"
            >
              {isAuthenticated ? (
                user.userName.charAt(0).toUpperCase()
              ) : (
                <CgProfile className="h-6 w-6" />
              )}
            </button>

            {/* ---------------------------Profile DropDown ------------ */}
            <ProfileMenuOpen
              isAuthenticated={isAuthenticated}
              navLinkClasses={navLinkClasses}
              handleCloseProfile={handleCloseProfile}
              handleLogout={handleLogout}
              isProfileOpen={isProfileOpen}
            />
          </div>
        </div>
      </nav>

      {/* ---------------------Mobile Menu -------------------*/}
      <MobileMenuOpen
        isMobileMenuOpen={isMobileMenuOpen}
        navLinkClasses={navLinkClasses}
      />
    </header>
  );
};

export default Navbar;
