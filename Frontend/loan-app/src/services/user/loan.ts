
import { loanApi,userLoanApi } from "../axiosConfig";
import { LoanApplicationDetails,LoanSubmission } from "../../constants/interfaces/loanInterface";

export const fetchLoanData = async (endpoint: string) => {
    try {
      const response = await loanApi.get(`/${endpoint}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  };


export const fetchUserData = async (endpoint: string, id:string) => {
    try {
      const response = await loanApi.get(`/${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  };



export const sendLoanApplication = async(data: LoanApplicationDetails) => {
  try {
    const response = await userLoanApi.post(`/loan/apply/`, data, {
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


export const sendLoanSubmission = async(data: LoanSubmission ) => {
  try {
    const response = await userLoanApi.post(`/loan/submission/`, data, {
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


export const getDetail = async (id: string, endpoint: string) => {
  try {
    const response = await loanApi.get(`/${endpoint}/${id}/`);

    console.log("API Response:", response.data); // Debugging log
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.error || "Something went wrong");
  }
};
