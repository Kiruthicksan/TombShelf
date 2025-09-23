
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  
  if (isAuthenticated) {
    return children;
  }

 
  return <Navigate to="/login" />;
};

export default ProtectedRoute;