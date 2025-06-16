  import { userApi } from "../services/axiosConfig";
  import { adminApi } from "../services/axiosConfig";
 export const fetchNotificationsPage = async () => {
    try {
      const response = await userApi.get(`/notifications/`);
      
      return response.data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  
 export const fetchAdminNotificationsPage = async () => {
    try {
      const response = await adminApi.get(`/notifications/`);
      
      return response.data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
