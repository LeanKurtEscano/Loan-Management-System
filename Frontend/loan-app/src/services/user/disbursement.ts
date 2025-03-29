import { userDisbursementApi } from "../axiosConfig";
import { SubmitDisbursement } from "../../constants/interfaces/disbursement";
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