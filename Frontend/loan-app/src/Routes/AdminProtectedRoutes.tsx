import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import useAdminTokenHandler from "../hooks/useAdminTokenHandler";
import { triggerBlacklist } from "../services/admin/adminData";
interface AdminProtectedProps {
  children: React.ReactNode;
}

const AdminProtectedRoutes: React.FC<AdminProtectedProps> = ({ children }) => {
  useAdminTokenHandler();
  const { isAdminAuthenticated } = useMyContext();
  useEffect(() => {
    triggerBlacklist()
  }, [])


  if (isAdminAuthenticated === null) {
    return null;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};


export default AdminProtectedRoutes;
