import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/store";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, hasAnyRole } = useAuthStore();


  if (!isAuthenticated) return <Navigate to="/login" replace />;

  
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
