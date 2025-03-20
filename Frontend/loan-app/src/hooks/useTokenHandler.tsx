import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import { userAuth } from "../services/user/token";

const useTokenHandler = () => {
  const { setIsAuthenticated } = useMyContext();
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.warn("No token found");
          setIsAuthenticated(false);
          setLoading(false);
          navigate("/login");
          return;
        }

        const isAuthenticated = await userAuth();

        if (isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          console.warn("Token is invalid");
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [setIsAuthenticated, navigate]);

  return loading; 
};

export default useTokenHandler;
