
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  

  if (isLoading) {
    return <div>Loading...</div>; 
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)){
    return <Navigate to = "/unauthorized" />
  }

 
  return children;
};

export default ProtectedRoute;