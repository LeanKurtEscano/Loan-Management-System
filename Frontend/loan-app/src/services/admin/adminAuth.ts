
import { adminAuth } from "../axiosConfig";





interface LoginData {
    username:string;
    password:string;
}

export const loginAdmin = async (data: LoginData) => {
    try {
      const response = await adminAuth.post("/login/", {data:data});
      return response
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };


    export const sendEmailAdmin = async() => {
      const response = await adminAuth.post(`/email/`, {
      }, {
          headers: {
              "Content-Type": "application/json"
          }
      })
  
      return response
  }


  export const logOutAdmin = async (
    setIsAdminAuthenticated: (value: boolean) => void,
    setToggleLog: (value: boolean) => void,
    navigate: (path: string) => void
  ) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
  
      if (!accessToken) {
        throw new Error("No access token found.");
      }
  
      const response = await adminAuth.post("/logout/", { refresh: refreshToken });
  
      if (response.status === 200) {
        setIsAdminAuthenticated(false);
        setToggleLog(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/admin-login");
      }
  
      return response;
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  