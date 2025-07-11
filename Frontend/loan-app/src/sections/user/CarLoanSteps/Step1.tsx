import React from "react";
import { motion } from "framer-motion";
import { useCarContext } from "../../../context/CarContext";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatDateWithWords } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getPayments } from "../../../services/user/disbursement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 
import { useMemo } from "react";
import { fetchCarLoanDisbursement } from "../../../services/rental/carDisbursement";
interface Step1Props {
    nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ nextStep }) => {

    const {  setCarPenalty,  setCarNoOfPenaltyDelay } = useCarContext();

    const { data, isLoading, isError } = useQuery(
        ['userCarLoanDisbursement'],
        fetchCarLoanDisbursement
    );
    const navigate = useNavigate();

    console.log(data);

    const goToTransactions = () => {
        navigate('/user/my-transactions');
    }

    const { data: dataDate, isLoading: loadingDate, isError: errorDate } = useQuery(
        ['userComparePaymentCarDate'],
        getPayments
    );



 

    const getPaymentPerPeriod = (
        totalPayment: number,
        startDate: string,
        endDate: string,
        frequency: string
    ) => {
        if (!totalPayment || !startDate || !endDate || !frequency) return "N/A";

        let start = new Date(startDate);
        let end = new Date(endDate);

        let numPeriods = 0;

        switch (frequency.toLowerCase()) {
            case "monthly":
                numPeriods = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                if (numPeriods === 0 && start.getDate() !== end.getDate()) {
                    numPeriods = 1;
                }
                break;
            case "yearly":
                numPeriods = end.getFullYear() - start.getFullYear();
                break;
            default:
                return "Invalid Frequency";
        }

        if (numPeriods <= 0) return "N/A";

        return formatCurrency(totalPayment / numPeriods);
    };

    const getDueDateFromPeriod = (startDate: string, periods: string[]) => {
        if (!startDate || periods.length === 0) return "N/A";

        let start = new Date(startDate);
        let totalMonths = 0;

        periods.forEach(period => {
            const periodMatch = period.match(/(\d+)\s*months?/);
            if (periodMatch) {
                totalMonths += parseInt(periodMatch[1], 10);
            }
        });

        start.setMonth(start.getMonth() + totalMonths + 1);

        return start.toISOString().split("T")[0]; 
    };

    const getNextPaymentDate = (startDate: string, frequency: string) => {
        if (!startDate || !frequency) return "N/A";
        let nextDate = new Date(startDate);

        switch (frequency.toLowerCase()) {
            case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case "yearly":
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            default:
                return "Invalid Frequency";
        }

        return nextDate.toISOString().split("T")[0]; 
    };

   {/* '2025-07-17' '2025-06-16' '2025-08-28' */}
    const calculatePastDueAndDelay = (dueDateString: string) => {
        if (dueDateString === "N/A" || dueDateString === "Invalid Frequency") {
            return { isPastDue: false, monthsOverdue: 0 };
        }
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        const dueDate = new Date(dueDateString);
        dueDate.setHours(0, 0, 0, 0);

        if (today.getTime() === dueDate.getTime()) {
        return { isPastDue: false, monthsOverdue: 0 };
    }
    
        if (today < dueDate) {
            return { isPastDue: false, monthsOverdue: 0 };
        }

      
        let monthsOverdue =
            (today.getFullYear() - dueDate.getFullYear()) * 12 +
            (today.getMonth() - dueDate.getMonth());
    
        if (today.getDate() > dueDate.getDate()) {
            monthsOverdue += 1;
        }
    
        return { isPastDue: true, monthsOverdue };
    };
    
    const totalPayment = data?.total_amount || "0";
    const balance = data?.balance || "0";
    const progressPercentage = totalPayment > 0 ? ((totalPayment - balance) / totalPayment) * 100 : 0;

 
    const rawDueDate = Array.isArray(dataDate) && dataDate.length > 0
        ? getDueDateFromPeriod(data?.start_date, dataDate.map((payment: { period: string }) => payment.period))
        : getNextPaymentDate(data?.start_date, data?.frequency);

 


    const formattedDueDate = rawDueDate !== "N/A" && rawDueDate !== "Invalid Frequency"
        ? formatDateWithWords(rawDueDate)
        : rawDueDate;


    const { isPastDue, monthsOverdue } = useMemo(() =>
        calculatePastDueAndDelay(rawDueDate),
        [rawDueDate]
    );

    console.log(isPastDue)

    // Check if payment is pending or processing
    const isPaymentPending = data?.payment_status === "Pending";



    useEffect(() => {
        if (isPastDue) {
            setCarPenalty(true);
            setCarNoOfPenaltyDelay(monthsOverdue); 
        } else {
            setCarPenalty(false);
            setCarNoOfPenaltyDelay(0); 
        }
    }, [isPastDue, monthsOverdue, setCarPenalty, setCarNoOfPenaltyDelay]);
    useEffect(() => {
        setCarPenalty(isPastDue);
    }, [isPastDue, setCarPenalty]);






    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br ">
            <div className="w-full max-w-2xl mx-auto">
                <motion.div
                    className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="text-center sm:text-left">
                                <p className="text-sm font-medium opacity-90">END DATE</p>
                                <p className="text-lg font-bold">{formatDateWithWords(data?.repay_date)}</p>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-sm font-medium opacity-90">FREQUENCY</p>
                                <p className="text-lg font-bold">{data?.frequency?.charAt(0).toUpperCase() + data?.frequency?.slice(1).toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-8 py-8">
                        {/* Balance Display */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className="text-sm font-medium text-gray-600 mb-2">Outstanding Balance</p>
                            <h1 className="text-5xl font-bold text-gray-900 mb-2">{formatCurrency(data?.balance)}</h1>
                        </motion.div>

                        {/* Progress Section */}
                        <div className="mb-8">
                            <motion.div
                                className="flex justify-between items-center mb-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-sm font-medium text-gray-600">Payment Progress</span>
                                <span className="text-lg font-bold text-blue-600">{progressPercentage.toFixed(0)}% Paid</span>
                            </motion.div>

                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-gray-700 text-center leading-relaxed">
                                Your next payment of <span className="font-bold text-gray-900">
                                    {getPaymentPerPeriod(totalPayment, data?.start_date, data?.repay_date, data?.frequency)}
                                </span> is due on <span className={`font-bold ${isPastDue ? 'text-red-600' : 'text-gray-900'}`}>
                                    {formattedDueDate}
                                </span>.
                                {isPastDue && (
                                    <span className="block mt-2 text-red-600 font-bold">
                                        ⚠️ Your payment is past due! Please make a payment immediately to avoid additional penalties.
                                    </span>
                                )}

                                {!isPastDue && parseFloat(data?.penalty) > 0 && (
                                    <span className="block mt-2 text-red-600 font-bold">
                                        ⚠️ You have a penalty to pay! Please clear your penalty.
                                    </span>
                                )}
                                {!isPastDue && !isPaymentPending && (
                                    <span className="block mt-2 text-gray-600">
                                        Please ensure timely payment to avoid any penalties. Thank you.
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Payment Processing Message */}
                        {isPaymentPending && (
                            <motion.div 
                                className="mb-6 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <p className="text-yellow-800 font-medium text-center">
                                        Your payment is currently being processed. Please wait for approval before making another payment.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <motion.button
                                whileHover={!isPaymentPending ? { scale: 1.02 } : {}}
                                whileTap={!isPaymentPending ? { scale: 0.98 } : {}}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
                                    isPaymentPending 
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' 
                                        : isPastDue 
                                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 hover:shadow-red-300' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-blue-300'
                                }`}
                                onClick={isPaymentPending ? undefined : nextStep}
                                disabled={isPaymentPending}
                            >
                                {isPaymentPending 
                                    ? 'Payment Processing...' 
                                    : isPastDue 
                                        ? 'Make Overdue Payment Now' 
                                        : 'Make a Payment'
                                }
                            </motion.button>
                            
                            <motion.button
                                onClick={goToTransactions}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                View Payment History
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Step1;