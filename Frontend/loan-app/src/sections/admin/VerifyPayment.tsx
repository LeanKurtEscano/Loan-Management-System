import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faArrowLeft,
    faCamera,
    faExclamationTriangle,
    faBan,
    faMoneyBillWave
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useMyContext } from "../../context/MyContext";
import { cleanImageUrl } from "../../utils/imageClean";
import { getPaymentDetail } from "../../services/user/disbursement";
import { formatCurrency } from "../../utils/formatCurrency";
import { adminDisbursementApi } from "../../services/axiosConfig";
import EmailModal from "../../components/EmailModal";
import ImageModal from "../../components/ImageModal";
import Modal from "../../components/Modal";

const VerifyPayment = () => {
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
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
    const [penaltyAmount, setPenaltyAmount] = useState<number | null>(null);
    const [loadingPenalty, setLoadingPenalty] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            const response = await adminDisbursementApi.post("/approve/payment/", {
                id: id,
                penaltyAmount: penaltyAmount
            });

            if (response.status === 200) {
                setIsModalOpen(false);
                queryClient.invalidateQueries(["userPayment", id]);
            }
        } catch (error) {
            console.error("Error approving payment:", error);
        } finally {
            setLoading(false);
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["userPayment", id],
        queryFn: () => getPaymentDetail(id, "payment"),
        enabled: !!id,
    });


    console.log(data);
    const rejectMutation = useMutation({
        mutationFn: async (id) => {
            setLoading2(true);
            await adminDisbursementApi.post("/reject/payment/", {
                id,
                subject: emailDetails.subject,
                description: emailDetails.description,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["userPayment"]);
            setLoading2(false);
            setIsReject(false);
        },
        onError: (error) => {
            console.error("Error rejecting payment:", error);
            setLoading2(false);
        }
    });

    const penaltyMutation = useMutation({
        mutationFn: async () => {
            setLoadingPenalty(true);
            await adminDisbursementApi.post("/apply/penalty/", {
                payment_id: id,
                amount: penaltyAmount
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["userPayment"]);
            setLoadingPenalty(false);
            setIsPenaltyModalOpen(false);
            setPenaltyAmount("");
        },
        onError: (error) => {
            console.error("Error applying penalty:", error);
            setLoadingPenalty(false);
        }
    });

    const openReject = (id) => {
        setIsReject(true);
        setSelectedId(id);
    };

    const handleReject = async () => {
        rejectMutation.mutateAsync(selectedId ?? 0);
    };



    const getStatusColor = (status) => {
        if (!status) return "bg-gray-500";
        status = status.trim();
        if (status === "Pending") return "bg-yellow-500";
        if (status === "Rejected") return "bg-red-500";
        return "bg-green-500";
    };

    const getStatusIcon = (status) => {
        if (!status) return faExclamationTriangle;
        status = status.trim();
        if (status === "Pending") return faExclamationTriangle;
        if (status === "Rejected") return faBan;
        return faCircleCheck;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">No data found!</h2>
                <p className="text-gray-600 mt-2">Unable to retrieve payment information.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 bg-blue-500 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                className="flex justify-center pt-8 items-center min-h-screen bg-gray-100 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    {/* Header Section */}
                    <div className="bg-blue-600 text-white p-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="cursor-pointer bg-white text-blue-600 font-medium px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 active:scale-95"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                <span>Back</span>
                            </button>

                            <div className="flex items-center">
                                <span className={`flex items-center gap-2 px-4 py-1 rounded-full text-white font-semibold ${getStatusColor(data?.status)}`}>
                                    <FontAwesomeIcon icon={getStatusIcon(data?.status)} />
                                    {data?.status || "Unknown Status"}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-center font-bold text-2xl mt-4">
                            Payment Verification
                        </h1>
                        <p className="text-center text-blue-100 mt-1">
                            Reviewing payment for {data?.user?.first_name} {data?.user?.last_name}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Receipt Image */}
                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 self-start">
                                Payment Receipt
                            </h2>
                            <div className="relative w-full">
                                <div className="bg-gray-100 rounded-lg p-2 shadow-inner">
                                    <img
                                        src={cleanImageUrl(data?.receipt)}
                                        alt="Payment Receipt"
                                        className="w-full h-[400px] object-cover rounded-lg shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
                                        onClick={() => setIsImageModalOpen(true)}
                                    />
                                </div>
                                <button
                                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 bg-opacity-90 text-white p-2 cursor-pointer rounded-full shadow-md hover:bg-opacity-100 transition-all duration-300"
                                    onClick={() => setIsImageModalOpen(true)}
                                >
                                    <FontAwesomeIcon icon={faCamera} className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Payment Information */}
                        <div className="flex flex-col">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Payment Information
                            </h2>

                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-5 flex-grow">
                                {/* User Information */}
                                <div className="mb-4">
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium border-b pb-2 mb-3">
                                        User Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500">First Name</label>
                                            <div className="text-gray-800 font-semibold">
                                                {data?.user?.first_name || "Not provided"}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Middle Name</label>
                                            <div className="text-gray-800 font-semibold">
                                                {data?.user?.middle_name || "Not provided"}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Last Name</label>
                                            <div className="text-gray-800 font-semibold">
                                                {data?.user?.last_name || "Not provided"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium border-b pb-2 mb-3">
                                        Payment Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-500">Cashout Type</label>
                                            <div className="text-gray-800 font-semibold">
                                                {data?.loan?.cashout
                                                    ? data.loan.cashout.charAt(0).toUpperCase() + data.loan.cashout.slice(1).toLowerCase()
                                                    : "Not provided"}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500">Period Paid</label>
                                            <div className="text-gray-800 font-semibold">
                                                {data?.period || "Not specified"}
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm text-gray-500">Amount Paid</label>
                                            <div className="text-green-600 text-xl font-bold">
                                                {formatCurrency(parseFloat(data?.amount).toFixed(2))}
                                            </div>
                                        </div>

                                        {data?.loan?.penalty > 0 && (
                                            <div className="col-span-2">
                                                <label className="block text-sm text-gray-500">Total Disbursement Penalty</label>
                                                <div className="text-red-600 font-medium flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                                    {formatCurrency(data?.loan?.penalty)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-center gap-4">
                                {data?.status?.trim() === "Pending" ? (
                                    <>
                                        <motion.button
                                            className="bg-green-500 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:bg-green-600 active:scale-95 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <FontAwesomeIcon icon={faCircleCheck} />
                                            Approve
                                        </motion.button>

                                        <motion.button
                                            className="bg-red-500 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:bg-red-600 active:scale-95 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openReject(data?.id)}
                                        >
                                            <FontAwesomeIcon icon={faBan} />
                                            Reject
                                        </motion.button>

                                        {data?.loan?.penalty && (
                                            <motion.button
                                                className="bg-amber-500 cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:bg-amber-600 active:scale-95 flex items-center gap-2"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsPenaltyModalOpen(true)}
                                            >
                                                <FontAwesomeIcon icon={faMoneyBillWave} />
                                                Deduct Penalty
                                            </motion.button>
                                        )}
                                    </>
                                ) : data?.status?.trim() === "Rejected" ? (
                                    <div className="flex items-center text-red-600 font-semibold text-lg bg-red-50 px-6 py-3 rounded-lg">
                                        <FontAwesomeIcon icon={faBan} className="text-2xl mr-2" />
                                        Payment Rejected
                                    </div>
                                ) : (
                                    <div className="flex items-center text-green-600 font-semibold text-lg bg-green-50 px-6 py-3 rounded-lg">
                                        <FontAwesomeIcon icon={faCircleCheck} className="text-2xl mr-2" />
                                        Payment Approved
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Approval Modal */}
                <Modal
                    loading={loading}
                    isOpen={isModalOpen}
                    title="Approve Payment"
                    message="Are you sure you want to approve this payment? Please verify that the payment has been successfully sent and that the attached receipt is valid."
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleApprove}
                />

                {/* Image Modal */}
                <ImageModal
                    imageUrl={cleanImageUrl(data?.receipt)}
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                />

                {/* Rejection Modal */}
                {isReject && selectedId !== null ? (
                    <EmailModal
                        loading={loading2}
                        isOpen={isReject}
                        onClose={() => setIsReject(false)}
                        onConfirm={handleReject}
                        heading="Reject Payment"
                        buttonText="Confirm Rejection"
                    />
                ) : null}

                {/* Penalty Modal */}
                <div className={`fixed inset-0  bg-gray-500/50  bg-opacity-40 z-50 flex items-center justify-center transition-opacity duration-300 ${isPenaltyModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <motion.div
                        className="bg-white rounded-xl p-6 w-96 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: isPenaltyModalOpen ? 1 : 0.9, opacity: isPenaltyModalOpen ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center mb-4 text-amber-500">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl mr-3" />
                            <h3 className="text-xl font-bold">Deduct Penalty</h3>
                        </div>

                        <p className="mb-5 text-gray-600">
                            Enter the  amount you want to deduct from the penalty, based on the provided receipt.
                        </p>

                        <div className="mb-5">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="penaltyAmount">
                                Penalty Amount
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₱</span>
                                </div>
                                <input
                                    type="number"
                                    id="penaltyAmount"
                                    value={penaltyAmount}
                                    onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                                    className="pl-7 shadow appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsPenaltyModalOpen(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsPenaltyModalOpen(false)}

                                disabled={!penaltyAmount || loadingPenalty}
                                className={`bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center gap-2 ${(!penaltyAmount || loadingPenalty) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loadingPenalty ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faMoneyBillWave} />
                                        Confirm
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerifyPayment;