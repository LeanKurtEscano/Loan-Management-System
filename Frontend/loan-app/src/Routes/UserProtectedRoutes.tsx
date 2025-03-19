import { Outlet, Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const UserProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children }) => {
  const 
  {isAuthenticated} = useMyContext(); ; 
  return isAuthenticated ? children || <Outlet /> : <Navigate to="/login" />;
};

export default UserProtectedRoutes;
