import { userApi } from "../axiosConfig";

export const reminderNotification = async (dueDate: string) => {
  try {
    const response = await userApi.post('/reminder/',{
        rawDueDate: dueDate

    });
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}