import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";

interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtectedRoutes: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdminAuthenticated } = useMyContext();
  const adminToken = localStorage.getItem("admin_token"); 

  
  if (!isAdminAuthenticated || !adminToken) {
    return <Navigate to="/admin-login" />; 
  }

  return <>{children}</>;
};

export default AdminProtectedRoutes;
