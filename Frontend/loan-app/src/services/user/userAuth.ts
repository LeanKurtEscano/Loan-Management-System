import { auth, userApi } from "../axiosConfig";
import { OtpDetails, RegisterData, ResetPasswordInterface } from "../../constants/interfaces/authInterface";
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


  export const userEmailResendRegister = async() => {
    const userEmail = sessionStorage.getItem("email");
    console.log(userEmail);
    const verification = "register"
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


  
  export const userEmailResendReset = async() => {
    const userEmail = sessionStorage.getItem("email");
    const verification = "reset_password"
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

  export const verifyHandler = async(otpData: OtpDetails, purpose: string) => {
   
    try {
      const response = await auth.post("/login/verify/", {
        data: otpData,
        purpose: purpose
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


export const verifyOtpReset  = async(otpData: OtpDetails) => {
  try {
    const response = await auth.post("/verify/reset/", {
      data: otpData,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}


export const ResetUserPassword = async(data: ResetPasswordInterface) => {
  
  try {
    const response = await auth.post("/reset/", {
      data: data,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export const logout = async() => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    const response = await userApi.post("/logout-user/", {refresh: refreshToken},
     );

    return response;
  } catch (error) {
    console.error("Logout error:", error)
  }
}


export const sendRegister = async(data: RegisterData)  => {
  try {
    const response = await auth.post("/register/", {
      data: data,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}