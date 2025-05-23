import { useState, useEffect } from "react";
import axios from "axios";
import { userApi } from "../services/axiosConfig";

const useVerificationStatus = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await userApi.get("/details/verify/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const status = response.data.status;
        setIsVerified(status === "Approved");
      } catch (error) {
        console.error("Error fetching verification status:", error);
        setIsVerified(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  return { isVerified };
};

export default useVerificationStatus;
