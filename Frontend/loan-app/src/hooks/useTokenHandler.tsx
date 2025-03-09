import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import { userAuth } from "../services/user/token";

const useTokenHandler = () => {
  const { setIsAuthenticated } = useMyContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await userAuth(); 

        if (isAuthenticated) {
          setIsAuthenticated(true);
        } 
        
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [setIsAuthenticated, navigate]);
};

export default useTokenHandler;
