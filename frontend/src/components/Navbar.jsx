import { NavLink, useNavigate } from "react-router-dom";
import TomeshelfLogo from "../assets/TomeshelfLogo 1.png";
import { HiMenu, HiOutlineSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "./hooks/useOutsideClick";
import { useAuthStore } from "../store/store";
import { Heart, ShoppingCart } from "lucide-react";
import MobileMenuOpen from "./MobileMenuOpen";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import CartIcon from "./CartIcon";

const Navbar = () => {
  //--------------------- auth store (global)-----------------------------------

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const isReader = useAuthStore((state) => state.user?.role === "reader");

  // ---------------------  local states --------------------------

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ------------ navigate ----------------------------------------

  const navigate = useNavigate();

  // ---------------------- Refs -------------------------------

  const genreRef = useRef(null);
  const dropDownRef = useRef(null);
  const timeOutRef = useRef(null);

  useOutsideClick(dropDownRef, () => setIsMobileMenuOpen(false));
  useOutsideClick(genreRef, () => setIsProfileOpen(false));

  //  ------------------ globalized main navlink for styling ----------------------------------
  const navLinkClasses = ({ isActive }) =>
    `block px-2 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "text-red-500 font-medium" : "text-[#2C3E50]"
    } hover:text-red-500 md:text-sm`;

  //------------------- logic for handling logout ---------------------------------------------------

  // ----------helper function to close profile menu automatically-------------------------------------
  const handleCloseProfile = () => setIsProfileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-md bg-background/95 backdrop-blur  supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-[60px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ----------------------Left: Logo ------------------------------------------------------*/}
        <div className="flex items-center gap-10 flex-shrink-0">
          <NavLink to="/">
            <img
              src={TomeshelfLogo}
              alt="Tomeshelf Logo"
              className="h-[28px]"
            />
          </NavLink>
        </div>

        {/* --------------------------Center: Nav links + Search (desktop only) -------------------*/}
        <div className="hidden md:flex  items-center ">
          <div className="flex gap-2">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>

            <NavLink to="/genre" className={navLinkClasses}>
              Novels
            </NavLink>

            {isAuthenticated && (
              <>
                {isReader && (
                  <>
                    <NavLink to="/library" className={navLinkClasses}>
                      Library
                    </NavLink>
                    <NavLink to="/help" className={navLinkClasses}>
                      About us
                    </NavLink>
                  </>
                )}
              </>
            )}

            {/* ................ Manage Books page for admin  ----------------------------- */}

            {isAuthenticated && isAdmin && (
              <>
                <NavLink className={navLinkClasses} to="/manage-books">
                  Manage Books
                </NavLink>
                <NavLink className={navLinkClasses} to="/manage-orders">
                  Manage Orders
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

          {/* ------------  Icons -----------------------------*/}

          <div className="relative  gap-5 flex items-center">
            {isAuthenticated && (
              <div className="hidden md:flex gap-4">
                <CartIcon />
              </div>
            )}

            {/* ---------------Profile icon ------------------------------ */}

            {isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="destructive"
                    className= "hidden md:flex"
                  >
                    Welcome{" "}
                    {user.userName.charAt(0).toUpperCase() +
                      user?.userName.slice(1).toLowerCase()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to access your profile</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="destructive"
                  >
                    Start Reading
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create Your Account</TooltipContent>
              </Tooltip>
            )}

            {/* ---------------------------Profile DropDown ------------ */}
          </div>
        </div>
      </nav>

      {/* ---------------------Mobile Menu -------------------*/}
      <MobileMenuOpen
        isMobileMenuOpen={isMobileMenuOpen}
        navLinkClasses={navLinkClasses}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        isReader = {isReader}
        user = {user}
      />
    </header>
  );
};

export default Navbar;
