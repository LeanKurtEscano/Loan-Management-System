
import { loanApi,userLoanApi } from "../axiosConfig";
import { LoanApplicationDetails } from "../../constants/interfaces/loanInterface";
export const fetchLoanData = async (endpoint: string) => {
    try {
      const response = await loanApi.get(`/${endpoint}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  };


export const sendLoanApplication = async(data: LoanApplicationDetails) => {
  try {
    const response = await userLoanApi.post(`/loan/apply/`, data);
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
