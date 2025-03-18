
import { ApplicationId } from "../../constants/interfaces/adminInterface";
import { loanApi } from "../axiosConfig";
export const verifyApplication = async(data: ApplicationId) => {
    try {

        const response = await loanApi.post(`/verify/application/`, data);

        return response

    } catch(error) {
        console.log("Something Went Wrong");
    }

}