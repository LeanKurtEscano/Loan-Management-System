import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft, faIdCard, faFileAlt, faUserCircle, faMoneyBillWave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetail } from "../../services/user/loan";
import { motion } from "framer-motion";
import { useState } from "react";
import { verifyApplication } from "../../services/admin/adminLoanManagement";
import { ApplicationApproveData } from "../../constants/interfaces/adminInterface";
import EmailModal from "../../components/EmailModal";
import { useMutation } from "@tanstack/react-query";
import { useMyContext } from "../../context/MyContext";
import { loanApi } from "../../services/axiosConfig";
import { cleanImageUrl } from "../../utils/imageClean";
import AdminVerifyModal from "../../components/AdminVerifyModal";

const VerifyApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const endpoint = "application";
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { emailDetails, approveLoan } = useMyContext();
  const [isReject, setIsReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoading2(true);
      await loanApi.post("/reject/", {
        id: id,
        subject: emailDetails.subject,
        description: emailDetails.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userApplication"]);
      setLoading2(false);
      setIsReject(false);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userApplication", id],
    queryFn: () => getDetail(id!, endpoint),
    enabled: !!id,
  });

  const questionsArray = data ? [
    { question: "Which of the following describes your level of education?", value: data.education_level },
    { question: "Employment Status", value: data.employment_status },
    { question: "How much money in total did you earn in the last 30 days (in PHP)?", value: data.monthly_income },
    { question: "How much does your pay change from one month to the next?", value: data.income_variation },
    { question: "What is your primary source of income?", value: data.primary_income_source },
    { question: "Do you have other sources of income aside from your employment or business?", value: data.other_sources_of_income },
    { question: "How frequently do you receive money from other sources on average?", value: data.money_receive ? "Regularly" : "None" },
    { question: "Is this your primary source of income?", value: data.primary_source },
    { question: "How much money do you receive from other sources of income on average?", value: data.money_receive || "N/A" },
    { question: "How much in total did you spend on basic needs, rent, bills, and existing loans in the last 30 days?", value: data.total_spend },
    { question: "What would you like to use your cash for?", value: data.purpose },
    { question: "Please describe how you will use the money in more detail", value: data.explanation },
    { question: "Do you have any outstanding loans?", value: data.outstanding }
  ] : [];

  const openReject = (id: number) => {
    setIsReject(true);
    setSelectedId(id);
  };

  const handleVerifyApplication = async () => {
    setLoading(true);
    const details: ApplicationApproveData = {
      id: data.id,
      loanAmount: approveLoan.loanAmount,
      interest: approveLoan.interest
    };

    try {
      const response = await verifyApplication(details);

      if (response?.status === 200) {
        setLoading(false);
        setIsModalOpen(false);
        queryClient.invalidateQueries(["userApplication", id]);
      }
    } catch (error) {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const handleReject = async () => {
    rejectMutation.mutateAsync(selectedId ?? 0);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      "Pending": "bg-yellow-500",
      "Rejected": "bg-red-500",
      "Approved": "bg-green-500"
    };
    return statusMap[status?.trim()] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-8 rounded-lg bg-white shadow-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 w-64 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-8 rounded-lg bg-white shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pt-6 pb-12 min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
            Go Back
          </button>


        </div>

        <motion.div
          className="bg-white shadow-lg rounded-xl overflow-hidden"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="bg-blue-600 p-5 flex items-center flex-col text-white">

            <h1 className="text-2xl font-bold text-center">Loan Application Review</h1>
            <p className="text-center mb-4  text-blue-100">
              Application #{`APP-${data?.id?.toString().padStart(6, "0")}`}
            </p>


            <span className={`px-4 py-1.5 rounded-full text-white font-medium ${getStatusColor(data?.status)}`}>
              {data?.status || "Unknown Status"}
            </span>

          </div>


          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("identity")}
                className={`py-4 px-6 cursor-pointer font-medium flex items-center ${activeTab === "identity"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"}`}
              >
                <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                Identity Verification
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 cursor-pointer px-6 font-medium flex items-center ${activeTab === "details"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"}`}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Application Details
              </button>
            </nav>
          </div>

          <div className="p-6">

            {activeTab === "identity" && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
                      Front of ID
                    </h3>
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
                      <img
                        src={cleanImageUrl(data?.front)}
                        alt="Front of ID"
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
                      Back of ID
                    </h3>
                    <div className="relative group overflow-hidden rounded-lg shadow-md">
                      <img
                        src={cleanImageUrl(data?.back)}
                        alt="Back of ID"
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Identity Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">ID Type</p>
                      <p className="font-medium text-gray-800">{data?.id_type || "Not provided"}</p>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                    Financial Summary
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-gray-500 text-sm">Monthly Income</p>
                      <p className="font-semibold text-gray-800 text-lg">{data?.monthly_income || "Not provided"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-gray-500 text-sm">Monthly Expenses</p>
                      <p className="font-semibold text-gray-800 text-lg">{data?.total_spend || "Not provided"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <p className="text-gray-500 text-sm">Loan Purpose</p>
                      <p className="font-semibold text-gray-800 text-lg">{data?.purpose || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionsArray.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-gray-600 text-sm mb-1">{item.question}</h3>
                      <div className="text-gray-800 font-medium">
                        {item.value || "Not provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - Always visible */}
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {data?.status.trim() === "Pending" ? (
                  <>
                    <motion.button
                      className="w-full sm:w-auto bg-green-500 cursor-pointer text-white font-medium px-6 py-3 rounded-lg shadow transition-all hover:bg-green-600 active:scale-98 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Approve Application
                    </motion.button>

                    <motion.button
                      className="w-full sm:w-auto bg-red-500 cursor-pointer text-white font-medium px-6 py-3 rounded-lg shadow transition-all hover:bg-red-600 active:scale-98 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openReject(data?.id)}
                    >
                      Reject Application
                    </motion.button>
                  </>
                ) : data?.status.trim() === "Rejected" ? (
                  <div className="flex items-center text-red-600 font-semibold text-lg p-3 bg-red-50 rounded-lg">
                    <FontAwesomeIcon icon={faTimes} className="text-2xl mr-2" />
                    Application Rejected
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 font-semibold text-lg p-3 bg-green-50 rounded-lg">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-2xl mr-2" />
                    Application Approved
                  </div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AdminVerifyModal
        loading={loading}
        isOpen={isModalOpen}
        title="Approve Loan Application"
        message="Please specify the loan amount and interest rate based on the applicant's eligibility:"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleVerifyApplication}
      />

      {isReject && selectedId !== null ? (
        <EmailModal
          loading={loading2}
          isOpen={isReject}
          onClose={() => setIsReject(false)}
          onConfirm={handleReject}
          heading="Reject Loan Application"
          buttonText="Submit Rejection"
        />
      ) : null}
    </motion.div>
  );
};

export default VerifyApplication;