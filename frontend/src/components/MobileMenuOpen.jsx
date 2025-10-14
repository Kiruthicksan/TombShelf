import { Heart, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";

const MobileMenuOpen = ({
  isMobileMenuOpen,
  navLinkClasses,
  isAuthenticated,
  isAdmin,
  isReader
}) => {
  return (
    <>
      <div>
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white shadow-lg border-t border-gray-200 flex flex-col animate-slide-down">
           
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/genre" className={navLinkClasses}>
             Novels
            </NavLink>
            <NavLink to="/library" className={navLinkClasses}>
              Library
            </NavLink>
            {isAuthenticated && isReader && (
              <>
               <NavLink className={navLinkClasses} to= "/help">About Us</NavLink>
              </>
            ) }
            {isAuthenticated && isAdmin && (
              <>
                <NavLink className={navLinkClasses} to= "/manage-books">Manage Books</NavLink>
                <NavLink className={navLinkClasses} to= "/manage-orders">Manage Orders</NavLink>
              </>
            )}
           
          </div>
        )}
      </div>
    </>
  );
};
export default MobileMenuOpen;
