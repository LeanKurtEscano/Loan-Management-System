import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetail } from "../../services/user/loan";
import { motion } from "framer-motion";

const VerifyApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const endpoint = "application";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userApplication", id],
    queryFn: () => getDetail(id!, endpoint),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>No data found!</div>;

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-xl bg-white shadow-md rounded-lg overflow-hidden"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
       <button
                onClick={() => navigate(-1)}
                className="m-5 md:left-40  cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                Go Back
            </button>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">
            {data?.user?.first_name} {data?.user?.middle_name && data?.user?.middle_name} {data?.user?.last_name}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-gray-600">First Name</h2>
              <p className="font-medium">{data?.user?.first_name}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Middle Name</h2>
              <p className="font-medium">{data?.user?.middle_name || "N/A"}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Last Name</h2>
              <p className="font-medium">{data?.user?.last_name}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Loan Type</h2>
              <p className="font-medium">{data?.type?.name}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Employment Status</h2>
              <p className="font-medium">{data?.employment_status}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Income Range</h2>
              <p className="font-medium">{data?.income_range}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Status</h2>
              <p className="font-medium text-yellow-500">{data?.status}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Loan Amount</h2>
              <p className="font-medium">PHP {data?.amount?.toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Repayment Plan</h2>
              <p className="font-medium">{data?.plan?.repayment_term} months ({data?.plan?.payment_frequency})</p>
            </div>
            <div>
              <h2 className="text-gray-600">Interest Rate</h2>
              <p className="font-medium">{data?.plan?.interest}%</p>
            </div>
            <div>
              <h2 className="text-gray-600">Application Date</h2>
              <p className="font-medium">{new Date(data?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
          <motion.button
            className="w-1/2  bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            onClick={() => alert("Application Verified!")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faCircleCheck} /> Verify
          </motion.button>

          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyApplication;
