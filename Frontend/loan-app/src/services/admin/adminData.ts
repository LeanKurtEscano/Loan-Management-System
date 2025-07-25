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

export const triggerBlacklist = async() => {
    try {
        const response = await adminApi.get(`/blacklist/`);

        if (response.status === 200) {
            console.log("");
        } else {
            console.log("");
        }
    } catch(error) {
        console.log("Something Went Wrong");
    }
}

export const getAdminDetails = async() => {
    try {

        const response = await adminApi.get(`/admin-details/`);
        console.log(response.status)
        console.log("Admin Details", response.data.data);
        return response.data.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}


export const getDetail = async(id:string, endpoint:  string) => {
    try {

        const response = await adminApi.get(`/${endpoint}/${id}/`);

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


export const searching = async(searchParam: string, endpoint: string) => {
    try {

        const response = await adminApi.get(`/search/${endpoint}/${searchParam}`)
        return response

    } catch (error) {
        console.log("Awit sayo")

    }
}






