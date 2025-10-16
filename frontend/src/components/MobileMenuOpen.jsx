import { Heart, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

const MobileMenuOpen = ({
  isMobileMenuOpen,
  navLinkClasses,
  isAuthenticated,
  isAdmin,
  isReader,
  user
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
           
            {isAuthenticated && isReader && (
              <>
               <NavLink to="/library" className={navLinkClasses}>
              Library
            </NavLink>
               <NavLink className={navLinkClasses} to= "/help">About Us</NavLink>
              </>
            ) }
            {isAuthenticated && isAdmin && (
              <>
                <NavLink className={navLinkClasses} to= "/manage-books">Manage Books</NavLink>
                <NavLink className={navLinkClasses} to= "/manage-orders">Manage Orders</NavLink>
              </>
            )}

             {isAuthenticated ? (
              
                  <Button
                    onClick={() => navigate("/profile")}
                    variant="destructive"
                    className= "hidden md:flex"
                  >
                    Welcome{" "}
                    {user.userName.charAt(0).toUpperCase() +
                      user?.userName.slice(1).toLowerCase()}
                  </Button>
                
                
            ) : (
              
                  <Button
                    onClick={() => navigate("/login")}
                    variant="destructive"
                  >
                    Start Reading
                  </Button>
                
            )}
           
          </div>
        )}
      </div>
    </>
  );
};
export default MobileMenuOpen;
