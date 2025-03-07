import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import { adminAuthToken } from "../services/adminToken";

const useAdminTokenHandler = () => {
  const { setIsAdminAuthenticated } = useMyContext(); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const isAdminAuthenticated = await adminAuthToken();

        if (isAdminAuthenticated) {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
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
