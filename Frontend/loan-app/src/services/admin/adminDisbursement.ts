import { adminDisbursementApi } from "../axiosConfig";


 
 export const getTransaction = async (id: string) => {
    try {
      const response = await adminDisbursementApi.get(`/disbursement/transactions/${id}`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  