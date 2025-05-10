
import { adminApi, adminAuth } from "../axiosConfig";
import { OtpDetails } from "../../constants/interfaces/authInterface";
import { ResetPasswordInterface } from "../../constants/interfaces/authInterface";



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



  export const verifyAdminOtpReset  = async(otpData: OtpDetails) => {
    try {
      const response = await adminAuth.post("/otp-password/", {
        data: otpData,
      });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  


    export const adminEmailResendReset = async() => {
      const userEmail = sessionStorage.getItem("admin_email");
      const verification = "reset_password_admin"
      try {
          const response = await adminAuth.post("/resend/", {
              purpose : verification,
              email : userEmail }
          );
          return response;
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
    }

  export const ResetAdminPassword = async(data: ResetPasswordInterface) => {
    
    try {
      const response = await adminAuth.post("/password/", {
        data: data,
      });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  
  

    export const sendEmailAdmin = async(email: string) => {
      const response = await adminAuth.post(`/email/`, {
        email:email
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
  