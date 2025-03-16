
import { loanApi } from "../axiosConfig";

export const fetchLoanData = async (endpoint: string) => {
    try {
      const response = await loanApi.get(`/${endpoint}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching loan data:", error);
      throw error;
    }
  };