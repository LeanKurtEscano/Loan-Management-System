import axios from "axios";

export const auth = axios.create({
    baseURL: "http://localhost:8000/user", 
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const refresh = axios.create({
    baseURL: "http://localhost:8000/user",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // This ensures cookies (refresh_token) are sent automatically
  });