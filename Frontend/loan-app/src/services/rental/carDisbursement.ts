import { userCarDisbursementApi } from "../axiosConfig";
import { SubmitDisbursement } from "../../constants/interfaces/disbursement";
import { adminCarDisbursementApi } from "../axiosConfig";
export const fetchCarLoanDisbursement = async () => {
    try { 
        const response =  await userCarDisbursementApi.get("/active-disbursement");
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan disbursement");
        }
        return response.data

    } catch (error) {
        console.error("Error fetching car loan disbursement:", error);
        throw error;
    }


}


  export const getCarTransactions = async () => {
    try {
      const response = await userCarDisbursementApi.get(`/payments/`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };



export const fetchCarLoanApplication = async () => {
    try { 
        const response =  await userCarDisbursementApi.get("/active-application");
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan disbursement");
        }
        return response.data

    } catch (error) {
        console.error("Error fetching car loan disbursement:", error);
        throw error;
    }


}






export const getPayments= async () => {
    try {
      const response = await userCarDisbursementApi.get(`/payment/`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  


  export const sendCarLoanPayment = async(data: SubmitDisbursement) => {
    try {
      const response = await userCarDisbursementApi.post(`/payment/`, data, {
        headers: {
          "Content-Type": "multipart/form-data", 
        }
      });
      return response;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  
  }
  




export const getCarPaymentDetail = async (id: string | number) => {
      try {
        const response = await adminCarDisbursementApi.get(`/payment/${id}/`);
    
        console.log("API Response:", response.data); 
        return response.data;
      } catch (error: any) {
        console.error("Error fetching data:", error?.response?.data || error.message);
        throw new Error(error?.response?.data?.error || "Something went wrong");
      }
    };
    