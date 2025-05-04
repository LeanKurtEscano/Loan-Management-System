import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCircleCheck, 
  faArrowLeft, 
  faBan, 
  faCamera,
  faExclamationTriangle,
  faMoneyBillWave
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetail } from "../../services/user/loan";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMyContext } from "../../context/MyContext";
import { loanApi } from "../../services/axiosConfig";
import EmailModal from "../../components/EmailModal";
import { cleanImageUrl } from "../../utils/imageClean";
import ImageModal from "../../components/ImageModal";
import Modal from "../../components/Modal";

const ApproveSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { emailDetails } = useMyContext();
  const [isReject, setIsReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const goToTransaction = () => {
    navigate(`/dashboard/submission/user-transaction/${id}`);
  };

  const handleApprove = async () => {
    setLoading(true);
    const response = await loanApi.post("/approve/disbursement/", {
      id: id
    });

    if (response.status === 200) {
      setLoading(false);
      setIsModalOpen(false);
      queryClient.invalidateQueries(["userSubmission", id]);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userSubmission", id],
    queryFn: () => getDetail(id, "submission"),
    enabled: !!id,
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      setLoading2(true);
      await loanApi.post("/reject/submission/", {
        id,
        subject: emailDetails.subject,
        description: emailDetails.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userSubmission"]);
      setLoading2(false);
      setIsReject(false);
    },
  });

  const openReject = (id) => {
    setIsReject(true);
    setSelectedId(id);
  };

  const handleReject = async () => {
    rejectMutation.mutateAsync(selectedId ?? 0);
  };

  // Helper function to check if penalty exists and is greater than 0
  const hasPenalty = data && data.penalty && parseFloat(data.penalty) > 0;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (isError || !data) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error!</strong> No data found or an error occurred.
      </div>
    </div>
  );

  return (
    <motion.div
      className="flex justify-center pt-8 items-center min-h-screen bg-gray-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-3xl bg-white shadow-lg rounded-xl overflow-hidden"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Header with navigation buttons */}
        <div className="bg-gray-50 p-5 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
              Go Back
            </button>

            <button
              onClick={goToTransaction}
              className="cursor-pointer bg-gray-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-white" />
              Transactions
            </button>
          </div>
        </div>

        {/* Title with status badge */}
        <div className="text-center pt-6">
          <h1 className="font-bold text-2xl text-gray-800 mb-3">
            Loan Disbursement Request
          </h1>
          
          <div className="flex justify-center items-center gap-2 mb-6">
            <span
              className={`px-4 py-1.5 rounded-full text-white font-semibold text-sm ${
                data?.status.trim() === "Pending"
                  ? "bg-yellow-500"
                  : data?.status.trim() === "Rejected"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {data?.status || "Unknown Status"}
            </span>
            
            {/* Show penalty badge if exists */}
            {hasPenalty && (
              <span className="px-4 py-1.5 rounded-full bg-red-500 text-white font-semibold text-sm flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                Penalty: ₱{parseFloat(data.penalty).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* ID Selfie with zoom button */}
        <div className="flex justify-center px-6 mb-6">
          <div className="relative w-full max-w-md">
            <img
              src={cleanImageUrl(data?.id_selfie)}
              alt="ID Selfie"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <button
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 bg-opacity-80 text-white p-2 cursor-pointer rounded-full shadow-md hover:bg-opacity-100 transition-all duration-300"
              onClick={() => setIsImageModalOpen(true)}
            >
              <FontAwesomeIcon icon={faCamera} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Applicant information */}
        <div className="px-8 pb-4">
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
              Applicant Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-1">Personal Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <div className="font-semibold text-gray-800">
                      {`${data?.user.first_name || ""} ${data?.user.middle_name || ""} ${data?.user.last_name || ""}`.trim() || "Not provided"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Contact Number</label>
                    <div className="font-semibold text-gray-800">
                      {data?.contact_number || "Not provided"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Cashout Method</label>
                    <div className="font-semibold text-gray-800 capitalize">
                      {data?.cashout || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-1">Loan Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <label className="text-sm text-gray-600">Loan Amount</label>
                      <div className="font-semibold text-green-600">
                        ₱{parseFloat(data?.loan_amount).toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600">Interest</label>
                      <div className="font-semibold text-gray-800">
                        {data?.loan_app.interest}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <label className="text-sm text-gray-600">Payment Frequency</label>
                      <div className="font-semibold text-gray-800 capitalize">
                        {data?.frequency || "Not specified"}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600">Repayment Date</label>
                      <div className="font-semibold text-gray-800">
                        {data?.repay_date || "Not specified"}
                      </div>
                    </div>
                  </div>
                  
                  {data?.status.trim() === "Approved" && (
                    <div className="flex justify-between">
                      <div>
                        <label className="text-sm text-gray-600">Start Date</label>
                        <div className="font-semibold text-gray-800">
                          {data?.start_date || "Not specified"}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600">Balance</label>
                        <div className="font-semibold text-red-600">
                          ₱{parseFloat(data?.balance).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Display penalty if it exists and is greater than 0 */}
                  {hasPenalty && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <label className="text-sm text-red-600 font-medium">Penalty Amount</label>
                      <div className="font-bold text-red-600 text-lg">
                        ₱{parseFloat(data.penalty).toFixed(2)}
                      </div>
                      {data?.last_penalty_update && (
                        <div className="text-xs text-red-500 mt-1">
                          Last updated: {new Date(data.last_penalty_update).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-gray-50 p-6 flex justify-center border-t">
          {data?.status.trim() === "Pending" ? (
            <div className="flex gap-4">
              <motion.button
                className="bg-blue-500 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:bg-blue-600 active:scale-95 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
              >
                {loading ? (
                  <div className="mr-2 h-4 w-4 border-2 border-t-white border-r-white border-b-white border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                )}
                Approve Disbursement
              </motion.button>

              <motion.button
                className="bg-red-500 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:bg-red-600 active:scale-95 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openReject(data?.id)}
                disabled={loading2}
              >
                {loading2 ? (
                  <div className="mr-2 h-4 w-4 border-2 border-t-white border-r-white border-b-white border-l-transparent rounded-full animate-spin"></div>
                ) : (
                  <FontAwesomeIcon icon={faBan} className="mr-2" />
                )}
                Reject
              </motion.button>
            </div>
          ) : data?.status.trim() === "Rejected" ? (
            <div className="flex items-center text-red-600 font-semibold text-lg">
              <FontAwesomeIcon icon={faBan} className="text-2xl mr-2" />
              Application Rejected
            </div>
          ) : (
            <div className="flex items-center text-green-600 font-semibold text-lg">
              <FontAwesomeIcon icon={faCircleCheck} className="text-2xl mr-2" />
              Disbursement Approved
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <Modal
        loading={loading}
        isOpen={isModalOpen}
        title="Approve Loan Disbursement?"
        message="Are you sure you want to approve this loan disbursement? The funds will be released once confirmed."
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleApprove}
      />

      <ImageModal
        imageUrl={cleanImageUrl(data?.id_selfie)}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      {isReject && selectedId !== null ? (
        <EmailModal
          loading={loading2}
          isOpen={isReject}
          onClose={() => setIsReject(false)}
          onConfirm={handleReject}
          heading="Reject Loan Application?"
          buttonText="Reject Loan Application"
        />
      ) : null}
    </motion.div>
  );
};

export default ApproveSubmission;