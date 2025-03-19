
import { adminApi, adminAuth } from "../axiosConfig";





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
  ) => {
    try {
      const accessToken = localStorage.getItem("admin_token");
      const refreshToken = localStorage.getItem("admin_refresh_token");
  
      if (!accessToken) {
        throw new Error("No access token found.");
      }
  
      const response = await adminApi.post("/logout/", { refresh: refreshToken });
      if (response.status === 200) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
        
      }
  
      return response;
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  