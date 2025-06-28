import axios from "axios";
import { rentalApi } from "../axiosConfig";



export const getCars = async () => {
  try {
    const response = await rentalApi.get("/cars/");     
    if (response.status !== 200) {
      throw new Error("Failed to fetch cars");
    }
    return response.data.cars; // Assuming the API returns an object with a 'cars' property
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
}