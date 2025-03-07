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
  