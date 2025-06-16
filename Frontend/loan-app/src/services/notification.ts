import { userApi } from "./axiosConfig";
import { adminApi } from "./axiosConfig";

export const getNotification = async(notifId:number ) => {
    const response = await userApi.get(`/notifications/details/${notifId}/`);
    return response.data.data;

}



export const getAdminNotification = async(notifId:number ) => {
    const response = await adminApi.get(`/notifications/details/${notifId}/`);
    return response.data.data;

}