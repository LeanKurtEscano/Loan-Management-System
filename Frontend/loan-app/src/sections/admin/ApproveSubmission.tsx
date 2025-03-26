import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../../components/ImageModal";
import Modal from "../../components/Modal";
const ApproveSubmission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { emailDetails } = useMyContext();
    const [isReject, setIsReject] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleApprove = async () => {
        setLoading(true)
        const response = await loanApi.post("/approve/disbursement/",{
            id: id
        })

        if(response.status === 200) {
            setLoading(true);
            setIsModalOpen(false);
            queryClient.invalidateQueries(["userSubmission",id])
        }
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userSubmission", id],
        queryFn: () => getDetail(id!, "submission"),
        enabled: !!id,
    });

    const rejectMutation = useMutation({
        mutationFn: async (id: number) => {
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

    const openReject = (id: number) => {
        setIsReject(true);
        setSelectedId(id);
    };

    const handleReject = async () => {
        rejectMutation.mutateAsync(selectedId ?? 0);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>No data found!</div>;

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
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="m-5 cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    Go Back
                </button>

                {/* Title */}
                <div className="text-center font-semibold text-2xl mb-4">
                    Approve Loan Disbursement Request
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-4">
                    <span
                        className={`px-3 py-1 rounded-full text-white font-semibold ${data?.status.trim() === "Pending"
                            ? "bg-yellow-500"
                            : data?.status.trim() === "Rejected"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                    >
                        {data?.status || "Unknown Status"}
                    </span>
                </div>




                <div className="flex flex-col gap-4 items-center mb-6">
                    <label className="block text-gray-600 font-medium mb-2">
                        Selfie with ID
                    </label>
                    <div className="relative">
                        
                        <img
                            src={cleanImageUrl(data?.id_selfie)}
                            alt="Front of ID"
                            className="w-[600px] h-60 object-cover rounded-md shadow"
                        />

                        <button
                            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 bg-opacity-80 text-white px-2 p-1 cursor-pointer rounded-full shadow-md hover:bg-opacity-90 transition-all duration-300"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <FontAwesomeIcon icon={faCamera} className="text-lg" />
                        </button>
                    </div>
                </div>

                <div className="p-6 pl-32 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Applicant Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <label className="block font-medium">First Name</label>
                            <div className="text-gray-800 font-semibold">
                                {data?.user.first_name || "Not provided"}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Middle Name</label>
                            <div className="text-gray-800 font-semibold">
                                {data?.user.middle_name || "Not provided"}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Last Name</label>
                            <div className="text-gray-800 font-semibold">
                                {data?.user.last_name || "Not provided"}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Cashout</label>
                            <div className="text-gray-800 font-semibold">
                                {data?.cashout || "Not provided"}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Loan Amount</label>
                            <div className="text-green-600 font-semibold">
                                ₱{parseFloat(data?.loan_amount).toFixed(2)}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Payment Frequency</label>
                            <div className=" font-semibold">
                                {data?.frequency}
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Repay Date</label>
                            <div className=" font-semibold">
                                {data?.repay_date}
                            </div>
                        </div>

                        {data?.status.trim() === "Approved" && (
                            <div>
                               
                                <label className="block font-medium">Start Date</label>
                                <div className=" font-semibold">
                                    {data?.start_date}
                                </div>
                            </div>

                            
                        )}

                        {data?.status.trim() === "Approved" && (
                            <div>
                                <label className="block font-medium">Balance</label>
                                <div className="text-red-600 font-semibold">
                                    ₱{parseFloat(data?.balance).toFixed(2)}
                                </div>

                              
                            </div>

                            
                        )}
                    </div>
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

             
            <Modal
                loading={loading}
                isOpen={isModalOpen}
                title="Approve Loan Disbursement?"
                message="Are you sure you want to approve this loan disbursement? The funds will be released once confirmed."
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleApprove}
            />

            </motion.div>

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
