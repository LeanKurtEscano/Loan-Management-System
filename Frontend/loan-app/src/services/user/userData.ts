import { userApi } from "../axiosConfig";
import { VerifyData } from "../../constants/interfaces/authInterface";

export const getUserDetails = async() => {
    try {

        const response = await userApi.get(`/details/`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}


export const sendVerifyData = async(data: VerifyData) => {
    try {

        const response = await userApi.post(`/account/verify/`, 
            data,
        {
            headers: {
              "Content-Type": "multipart/form-data", 
            }
          }

        );

        return response

    } catch(error) {
        console.log("Something Went Wrong");
    }

}