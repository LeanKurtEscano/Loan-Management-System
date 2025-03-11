import { adminApi } from "../axiosConfig";


export const getUserDetails = async() => {
    try {

        const response = await adminApi.get(`/users/`);

        return response.data.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}

