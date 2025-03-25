import { userApi } from "../axiosConfig";
import { VerifyData } from "../../constants/interfaces/authInterface";
import { userLoanApi } from "../axiosConfig";
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


export const getUserVerifyDetails = async() => {
    try {

        const response = await userApi.get(`/details/verify/`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}

export const getLoanApplication = async() => {
    try {

        const response = await userLoanApi.get(`/user/application/`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}


export const getLoanSubmission = async() => {
    try {

        const response = await userLoanApi.get(`/user/submission/`);

        return response.data

    } catch(error) {
        console.log("Something Went Wrong");
    }

}

