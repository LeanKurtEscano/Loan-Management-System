import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import { adminAuthToken } from "../services/admin/adminToken";

const useAdminTokenHandler = () => {
  const { setIsAdminAuthenticated } = useMyContext(); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          setIsAdminAuthenticated(false);
          navigate("/admin-login");
          return;
        }

        const isAdminAuthenticated = await adminAuthToken();

        setIsAdminAuthenticated(isAdminAuthenticated);

        if (!isAdminAuthenticated) {
          navigate("/admin-login");
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setIsAdminAuthenticated(false);
        navigate("/admin-login");
      }
    };

    checkAdminAuth();
  }, [setIsAdminAuthenticated, navigate]);
};

export default useAdminTokenHandler;
