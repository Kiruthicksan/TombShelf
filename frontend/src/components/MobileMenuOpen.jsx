import { Heart, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileMenuOpen = ({
  isMobileMenuOpen,
  navLinkClasses,
  isAuthenticated,
}) => {
  return (
    <>
      <div>
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white shadow-lg border-t border-gray-200 flex flex-col animate-slide-down">
            <div className="p-4">
              <input
                type="search"
                placeholder="Search for books..."
                className="w-full h-10 rounded-lg border border-[#BDC3C7] px-4 text-sm outline-none placeholder:text-[#BDC3C7] focus:border-[#3498DB]"
              />
            </div>
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/genres" className={navLinkClasses}>
              Genres
            </NavLink>
            <NavLink to="/category" className={navLinkClasses}>
              Category
            </NavLink>
           
          </div>
        )}
      </div>
    </>
  );
};
export default MobileMenuOpen;
