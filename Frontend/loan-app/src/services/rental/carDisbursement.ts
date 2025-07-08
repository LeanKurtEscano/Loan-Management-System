import { userCarDisbursementApi } from "../axiosConfig";


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