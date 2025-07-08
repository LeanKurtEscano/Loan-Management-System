import { adminRentalApi } from "../axiosConfig";



export const fetchCarLoanApplications = async () => {  

    try {
        const response = await adminRentalApi.get("/loan-apps/");
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan applications");
        }
        return response.data; // Assuming the API returns an object with a 'car_loan_applications' property
    } catch (error) {
        console.error("Error fetching car loan applications:", error);  }

}


export const fetchCarLoanDisbursements = async () => {  

    try {
        const response = await adminRentalApi.get("/disbursements/");
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan applications");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching car loan applications:", error);  }

}


export const fetchDisbursementData = async (id:string) => {  

    try {
        const response = await adminRentalApi.get(`/disbursements/${id}/`);
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan applications");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching car loan applications:", error);  }

}






export const fetchCarLoanApplicationDetails = async (id:number) => {  

    try {
        const response = await adminRentalApi.get(`/loan-apps/${id}/`);
        if (response.status !== 200) {
            throw new Error("Failed to fetch car loan applications");
        }
        return response.data; // Assuming the API returns an object with a 'car_loan_applications' property
    } catch (error) {
        console.error("Error fetching car loan applications:", error);  }

}

