import React from "react";
import { Navigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const UserProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useMyContext();
    const userToken = localStorage.getItem("access_token"); 

    if (!isAuthenticated && !userToken) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default UserProtectedRoutes;
