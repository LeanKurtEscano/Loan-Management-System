import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/MyContext";
import { userAuth } from "../services/token";

const useTokenHandler = () => {
  const { setIsAuthenticated } = useMyContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {

      try {
        const isAuthenticated = await userAuth();

        if (isAuthenticated) {
          setIsAuthenticated(true);

        } else {

          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
         
        }

      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        navigate("/");
      }

    };

    checkAuth();
  }, [setIsAuthenticated, navigate]);

};

export default useTokenHandler;
