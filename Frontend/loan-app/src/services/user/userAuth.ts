import { auth } from "../axiosConfig";
import { OtpDetails } from "../../constants/interfaces/authInterface";
interface LoginData {
    email:string;
    password:string;
}

export const loginAuth = async(data: LoginData) => {
    try {
      const response = await auth.post("/login/", { data: data });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  export const userEmailResend = async() => {
    const userEmail = sessionStorage.getItem("email");
    const verification = "verification"
    try {
        const response = await auth.post("/resend/", {
            purpose : verification,
            email : userEmail }
        );
        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
  }

  export const verifyLogin = async(otpData: OtpDetails) => {
  
    try {
      const response = await auth.post("/login/verify/", {
        data: otpData,
      });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }


  export const sendEmail = async(email:string) => {
    const response = await auth.post(`/email/`, {
        email:email
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })

    return response
}