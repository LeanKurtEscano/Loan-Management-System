import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const UserProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useMyContext();
 
    if (!isAuthenticated ) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default UserProtectedRoutes;
