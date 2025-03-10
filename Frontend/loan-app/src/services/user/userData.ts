import { userApi } from "../axiosConfig";


export const getUserDetails = async() => {
    try {

        const response = await userApi.get(`/details/`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}