import {  Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import useTokenHandler from "../hooks/useTokenHandler";
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const UserProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children }) => {
   


  const  {isAuthenticated} = useMyContext(); 
  


   if (isAuthenticated === null) {
      return null; 
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <>{children}</>;
  
};

export default UserProtectedRoutes;
