import { userDisbursementApi } from "../axiosConfig";
import { SubmitDisbursement } from "../../constants/interfaces/disbursement";
import { adminDisbursementApi } from "../axiosConfig";
export const sendLoanPayment = async(data: SubmitDisbursement) => {
  try {
    const response = await userDisbursementApi.post(`/payment/`, data, {
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


export const fetchPaymentsData = async (endpoint: string) => {
    try {
      const response = await adminDisbursementApi.get(`/${endpoint}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  };


  
  export const getPaymentDetail = async (id: string, endpoint: string) => {
    try {
      const response = await adminDisbursementApi.get(`/${endpoint}/${id}/`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  

  export const getTransactions = async () => {
    try {
      const response = await userDisbursementApi.get(`/transactions/`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  
  export const getTransaction = async (id: number) => {
    try {
      const response = await userDisbursementApi.get(`/transactions/${id}`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  
  export const getPayments= async () => {
    try {
      const response = await userDisbursementApi.get(`/payment/date`);
  
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.error || "Something went wrong");
    }
  };
  
