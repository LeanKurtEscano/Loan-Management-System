import { adminRentalApi } from "../axiosConfig";


export const getCarApplications = async () => {
  try {
    const response = await adminRentalApi.get("/loan-apps/");
    if (response.status !== 200) {
      throw new Error("Failed to fetch car applications");
    }
    return response.data
  } catch (error) {
    console.error("Error fetching car applications:", error);
    throw error;
  }
}

export const getCarApplicationById = async (applicationId: number) => {
  try {
    const response = await adminRentalApi.get(`/loan-apps/${applicationId}/`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch car application");
    }
    return response.data
  } catch (error) {
    console.error("Error fetching car application:", error);
    throw error;
  }
}