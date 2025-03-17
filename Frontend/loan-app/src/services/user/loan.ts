
import { loanApi } from "../axiosConfig";
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
    const response = await loanApi.post(`/loan/apply/`, data);
    return response;
  } catch (error) {
    console.error("Error fetching loan data:", error);
    throw error;
  }
}