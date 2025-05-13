import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetail, verifyUser } from "../../services/admin/adminData";
import { motion } from "framer-motion";
import { ApplicationData } from "../../constants/interfaces/adminInterface";

import Modal from "../../components/Modal";

import { ApplicationId } from "../../constants/interfaces/adminInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faArrowLeft,
  faUser,
  faCalendarDays,
  faVenusMars,
  faRing,
  faLocationDot,
  faEnvelope,
  faPhone,
  faSignature,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { useMyContext } from "../../context/MyContext";
import { adminApi } from "../../services/axiosConfig";
import EmailModal from "../../components/EmailModal";

const Verification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { emailDetails } = useMyContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const endpoint = "users";


  const { data, isLoading, isError } = useQuery<ApplicationData>({
    queryKey: ["userDetail", id],
    queryFn: () => getDetail(id!, endpoint),
    enabled: !!id,
  });


  console.log(data)


  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoading2(true);
      await adminApi.post('/reject/', {
        id: id,
        subject: emailDetails.subject,
        description: emailDetails.description
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userDetail', id]);
      setLoading2(false);
      setIsReject(false);
    }
  });

  const handleVerifyUser = async () => {
    setLoading(true);
    const details: ApplicationId = {
      id: data?.id!,
      user: data?.user!,
    };

    try {
      const response = await verifyUser(details);
      if (response?.status === 200) {
        setIsModalOpen(false);
        setLoading(false);
        queryClient.invalidateQueries(["userDetail", id]);
      }
    } catch (error) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  const openReject = (id: number) => {
    setIsReject(true);
    setSelectedId(id);
  };

  const handleReject = async () => {
    rejectMutation.mutateAsync(selectedId ?? 0);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600">We couldn't fetch the user details. Please try again later.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const status = data?.status.trim() || "";

    if (status === "Approved") {
      return <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Verified</span>;
    } else if (status === "Rejected") {
      return <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">Rejected</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">Pending</span>;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="  cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
            Go Back
          </button>

        </div>


        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-white p-2 px-3 rounded-full shadow-md">
                  <FontAwesomeIcon icon={faUser} className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4 text-white">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {data?.first_name} {data?.middle_name} {data?.last_name} {data?.suffix && data.suffix.charAt(0).toUpperCase() + data.suffix.slice(1)}
                  </h1>

                </div>
              </div>
              <div>
                {getStatusBadge()}
              </div>
            </div>
          </div>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faSignature} className="text-gray-400 mr-2" />
              Personal Information
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <span className="text-sm text-gray-500 mb-1 block">Full Name</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-medium text-blue-700 bg-white p-2 rounded shadow-sm border border-blue-100 flex-grow">
                      <span className="text-gray-500 mr-1 text-xs">First:</span> {data?.first_name || "N/A"}
                    </span>
                    <span className="font-medium text-blue-700 bg-white p-2 rounded shadow-sm border border-blue-100 flex-grow">
                      <span className="text-gray-500 mr-1 text-xs">Middle:</span> {data?.middle_name || "N/A"}
                    </span>
                    <span className="font-medium 1 text-blue-700 bg-white p-2 rounded shadow-sm border border-blue-100 flex-grow">
                      <span className="text-gray-500 mr-1 text-xs">Last:</span> {data?.last_name || "N/A"}
                    </span>
                    {data?.suffix && (
                      <span className="font-medium text-blue-700 pr-10 bg-white p-2 rounded shadow-sm border border-blue-100">
                        <span className="text-gray-500 mr-1  text-xs">Suffix:</span> {data.suffix.charAt(0).toUpperCase() + data.suffix.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User details section */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Date of Birth & Age</p>
                  <p className="font-medium">{data?.birthdate} ({data?.age} years old)</p>
                </div>
              </div>

              <div className="flex items-start">
                <FontAwesomeIcon icon={faVenusMars} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="font-medium">{data?.gender}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FontAwesomeIcon icon={faRing} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Civil Status</p>
                  <p className="font-medium">{data?.marital_status}</p>
                </div>
              </div>



              <div className="flex items-start sm:col-span-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-gray-500 text-sm">Complete Address</p>
                  <p className="font-medium">{data?.address}</p>
                  <p className="text-sm text-gray-500 mt-1">Postal Code: {data?.postal_code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            {data?.status.trim().toLowerCase() === "pending" ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                <motion.button
                  className="bg-white cursor-pointer border border-red-500 text-red-500 font-medium px-6 py-2 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openReject(data?.id)}
                >
                  Reject
                </motion.button>

                <motion.button
                  className="bg-blue-500 cursor-pointer text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faCircleCheck} />
                  Approve
                </motion.button>
              </div>
            ) : data?.status.trim() === "Rejected" ? (
              <div className="flex justify-end">
                <div className="flex items-center text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  User Verification Rejected
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="flex items-center text-green-600 font-medium">
                  <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                  Verified User
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <Modal
        loading={loading}
        isOpen={isModalOpen}
        title="Confirm Verification"
        message="Are you sure you want to verify this user?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleVerifyUser}
      />

      {isReject && selectedId !== null && (
        <EmailModal
          loading={loading2}
          isOpen={isReject}
          onClose={() => setIsReject(false)}
          onConfirm={handleReject}
          heading="Reject User Verification?"
          buttonText="Reject User Verification"
        />
      )}
    </motion.div>
  );
};

export default Verification;