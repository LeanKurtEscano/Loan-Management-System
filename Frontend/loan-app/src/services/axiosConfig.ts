import axios from "axios";

export const auth = axios.create({
   baseURL: "http://127.0.0.1:8000/user",
    headers: {
      "Content-Type": "application/json",
    },
  });


  export const refresh = axios.create({
    baseURL: "http://localhost:8000/user",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, 
  });


export const userApi = axios.create({
    baseURL: "http://localhost:8000/user",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
 
  userApi.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  

export const adminAuth = axios.create({
    baseURL: "http://127.0.0.1:8000/loan-admin",
     headers: {
       "Content-Type": "application/json",
     },
   });

export const adminRefresh = axios.create({
    baseURL: "http://127.0.0.1:8000/loan-admin",
     headers: {
       "Content-Type": "application/json",
     },
     withCredentials: true,
   });
 
export const adminToken = localStorage.getItem("admin_token");
   export const adminApi = axios.create({
     baseURL: "http://localhost:8000/loan-admin",
     headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${adminToken}`
     },
      
   });
   