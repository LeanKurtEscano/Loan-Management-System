import { jwtDecode } from "jwt-decode";
import {  refresh } from "./axiosConfig";

const isTokenExpired = (token: string) => {
    const decoded: { exp: number } = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const currentTime = Date.now() / 1000;

    return tokenExpiration < currentTime;
};

const refreshUserToken = async (): Promise<boolean> => {
    try {
        const response = await refresh.post("/token/refresh/"); 

        if (response.status === 200) {
            const newAccessToken = response.data.access_token;
            localStorage.setItem("access_token", newAccessToken);
            return true;
        }
    } catch (error: any) {
        console.error("Refresh token failed:", error);

        // If the refresh token is invalid or expired, remove tokens and return false
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            return false;
        }
    }

    return false;
};


export const userAuth = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) return false;

    if (isTokenExpired(accessToken)) {
        return (await refreshUserToken()) ?? false; 
    }

    return true;
};

