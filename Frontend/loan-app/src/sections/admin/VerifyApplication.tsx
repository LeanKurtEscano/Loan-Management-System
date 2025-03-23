import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetail } from "../../services/user/loan";
import { motion } from "framer-motion";
import { useState } from "react";
import { verifyApplication } from "../../services/admin/adminLoanManagement";
import { ApplicationApproveData, ApplicationData } from "../../constants/interfaces/adminInterface";
import Modal from "../../components/Modal";
import EmailModal from "../../components/EmailModal";
import { useMutation } from "@tanstack/react-query";
import { useMyContext } from "../../context/MyContext";
import { loanApi } from "../../services/axiosConfig";
import { cleanImageUrl } from "../../utils/imageClean";
import AdminVerifyModal from "../../components/AdminVerifyModal";
const VerifyApplication = () => {
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      setLoading2(true);
      const response = await loanApi.post("/reject/", {
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userApplication", id],
    queryFn: () => getDetail(id!, endpoint),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>No data found!</div>;

  const questionsArray = [
    { question: "Which of the following describes your level of education?", value:  data.education_level},
    { question: "Employment Status", value: data.employment_status },
    { question: "How much money in total did you earn in the last 30 days (in PHP)?", value: data.monthly_income },
    { question: "How much does your pay change from one month to the next?", value: data.income_variation },
    { question: "What is your primary source of income?", value: data.primary_income_source },
    { question: "Do you have other sources of income aside from your employment or business? (Check all that apply)", value: data.other_sources_of_income },
    { question: "How frequently do you receive money from other sources on average? (Select 'None' if you have no other income)", value: "" },
    { question: "Is this your primary source of income? (Select no if you have no other source of income)", value: data.primary_source },
    { question: "How much money do you receive from other sources of income on average? (Type N/A if you have no other source of income)", value: data.money_receive },
    { question: "How much in total did you spend on basic needs, rent, bills, and existing loan (if you have) in the last 30 days?", value: data.total_spend },
    { question: "What would you like to use your cash for?", value: data.purpose },
    { question: "Please describe how you will use the money in more detail", value: data.explanation },
    { question: " Do you have any outstanding loans?", value: data.outstanding }
  
  ];
  

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

  return (
    <motion.div
    className="flex justify-center pt-8 items-center min-h-screen bg-gray-100 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden"
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="m-5 md:left-40 cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
        Go Back
      </button>

      <div className="p-6">
        <div className="text-center font-semibold text-2xl mb-4">
          Verify Loan Application
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-white font-semibold ${data?.status.trim() === "Pending" ? "bg-yellow-500" : data?.status.trim() === "Rejected" ? "bg-red-500" : "bg-green-500"}`}
          >
            {data?.status || "Unknown Status"}
          </span>
        </div>

        {/* Front and Back of ID Images */}
        <div className="flex flex-col gap-4 items-center mb-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Front of the ID
            </label>
            <img
              src={cleanImageUrl(data?.front)}
              alt="Front of ID"
              className="w-[600px] h-60 object-cover rounded-md shadow"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Back of the ID
            </label>
            <img
              src={cleanImageUrl(data?.back)}
              alt="Back of ID"
              className="w-[600px] h-60 object-cover rounded-md shadow"
            />
          </div>

          <div className="mt-4 ">
            <label className="block text-gray-600 font-medium mb-2">
              Type of ID
            </label>
            <div className="text-lg font-semibold text-gray-800">
              {data?.id_type || "Not provided"}
            </div>
          </div>
        </div>

        {/* Airbnb-styled Questions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Application Details
          </h2>
          {questionsArray.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg"
            >
              <h3 className="text-gray-600 font-medium mb-1">{item.question}</h3>
              <div className="text-gray-800 font-semibold">
                {item.value || "Not provided"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center mt-6">
          <div className="p-4 flex gap-3 justify-center">
            {data?.status.trim() === "Pending" ||
            data?.status.trim() === "Rejected" ? (
              <>
                <motion.button
                  className="bg-blue-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all hover:bg-blue-600 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Approve
                </motion.button>

                <motion.button
                  className="bg-red-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all hover:bg-red-600 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openReject(data?.id)}
                >
                  Reject
                </motion.button>
              </>
            ) : (
              <div className="flex items-center text-blue-600 font-semibold text-lg">
                <FontAwesomeIcon icon={faCircleCheck} className="text-2xl mr-2" />
                Approved
              </div>
            )}
          </div>
        </div>

        <AdminVerifyModal
          loading={loading}
          isOpen={isModalOpen}
          title="Approve Loan Application?"
          message="How much loan amount and interest should be granted based on the user's eligibility?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleVerifyApplication}
        />
      </div>
    </motion.div>

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

export default VerifyApplication;
