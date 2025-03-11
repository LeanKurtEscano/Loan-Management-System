import { jwtDecode } from "jwt-decode";
import { adminAuth } from "../axiosConfig";
const isTokenExpired = (token: string) => {
    const decoded: { exp: number } = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const currentTime = Date.now() / 1000;
    return tokenExpiration < currentTime;
};

const refreshAdminToken = async () => {
    const adminRefreshToken = localStorage.getItem("admin_refresh_token");
    if (!adminRefreshToken) return false;

    if (isTokenExpired(adminRefreshToken)) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
        return false;
    }

    try {
        const response = await adminAuth.post('/token/refresh/', {
            refresh: adminRefreshToken
        });

        if (response.status === 200) {
            const newAdminAccessToken = response.data.access;
            localStorage.setItem("admin_token", newAdminAccessToken);
            return true;
        }
    } catch (error: any) {
        console.error("Admin refresh token failed:", error);

        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_refresh_token");
            return false;
        }
    }
};

export const adminAuthToken = async (): Promise<boolean> => {
    const adminAccessToken = localStorage.getItem("admin_token");
    if (!adminAccessToken) return false;

    if (isTokenExpired(adminAccessToken)) {
        return (await refreshAdminToken()) ?? false;
    }

    return true;
};
