import { userApi } from "./axiosConfig";


export const getNotification = async(notifId:number ) => {
    const response = await userApi.get(`/notifications/details/${notifId}/`);
    return response.data.data;

}