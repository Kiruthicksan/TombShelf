import { NavLink } from "react-router-dom";

const ProfileMenuOpen = ({
  isAuthenticated,
  navLinkClasses,
  handleCloseProfile,
  handleLogout,
  isProfileOpen,
  
}) => {
  return (
    <>
      {isProfileOpen && (
        
        <div className="absolute right-0 top-12 w-44 rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200">
          <ul className="flex flex-col text-sm text-[#2C3E50]">
           
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={navLinkClasses}
                    onClick={handleCloseProfile}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/orders"
                    className={navLinkClasses}
                    onClick={handleCloseProfile}
                  >
                    Orders
                  </NavLink>
                </li>
                <button
                  className="text-left px-4 hover:bg-[#ECF0F1]  py-2 rounded-lg transition-colors duration-200 hover:text-[#3498DB]"
                  onClick={() => {
                    handleLogout();
                    handleCloseProfile();
                  }}
                >
                  LogOut
                </button>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={navLinkClasses}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={navLinkClasses}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};
export default ProfileMenuOpen;
