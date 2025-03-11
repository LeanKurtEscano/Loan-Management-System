import { adminApi } from "../axiosConfig";
import { ApplicationId } from "../../constants/interfaces/adminInterface";

export const getUserDetails = async() => {
    try {

        const response = await adminApi.get(`/users/`);

        return response.data.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}

export const getDetail = async(id:string) => {
    try {

        const response = await adminApi.get(`/users/${id}`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}

export const verifyUser = async(data: ApplicationId) => {
    try {

        const response = await adminApi.post(`/verify/`, data);

        return response

    } catch(error) {
        console.log("Something Went Wrong");
    }

}




