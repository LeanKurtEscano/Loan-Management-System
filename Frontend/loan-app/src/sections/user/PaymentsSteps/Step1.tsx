import React from "react";
import { motion } from "framer-motion";
import { useMyContext } from "../../../context/MyContext";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatDateWithWords } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getPayments } from "../../../services/user/disbursement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 
import { useMemo } from "react";
interface Step1Props {
    nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ nextStep }) => {

    const {  setPenalty,  setNoOfPenaltyDelay } = useMyContext();

    const { data, isLoading, isError } = useQuery(
        ['userLoanSubmission1'],
        getLoanSubmission
    );
    const navigate = useNavigate();

    console.log(data);

    const goToTransactions = () => {
        navigate('/user/my-transactions');
    }

    const { data: dataDate, isLoading: loadingDate, isError: errorDate } = useQuery(
        ['userCompareDate'],
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
    
    const totalPayment = data?.total_payment || "0";
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
            setPenalty(true);
            setNoOfPenaltyDelay(monthsOverdue); 
        } else {
            setPenalty(false);
            setNoOfPenaltyDelay(0); 
        }
    }, [isPastDue, monthsOverdue, setPenalty, setNoOfPenaltyDelay]);
    useEffect(() => {
        setPenalty(isPastDue);
    }, [isPastDue, setPenalty]);






    return (
        <motion.div
            className="relative flex justify-center items-center min-h-screen p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-300 relative">
                <div className="flex justify-between items-center mb-9 mt-6">
                    <h2 className="text-gray-600 text-lg font-semibold">
                        END DATE: <span className="text-gray-900 text-lg font-bold">{formatDateWithWords(data?.repay_date)}</span>
                    </h2>
                    <h3 className="text-gray-600 text-lg font-semibold">
                        FREQUENCY: <span className="text-gray-900 text-lg font-bold">{data?.frequency?.charAt(0).toUpperCase() + data?.frequency?.slice(1).toLowerCase()}</span>
                    </h3>
                </div>

                <motion.div
                    className="text-center mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl font-extrabold text-gray-900">{formatCurrency(data?.balance)}</h1>
                </motion.div>

                <motion.div
                    className="text-center text-lg font-semibold text-blue-500 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {progressPercentage.toFixed(0)}% Paid
                </motion.div>

                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>

                <p className="text-gray-700 text-sm mt-5 text-center leading-relaxed">
                    Your next payment of <span className="font-semibold">
                        {getPaymentPerPeriod(totalPayment, data?.start_date, data?.repay_date, data?.frequency)}
                    </span> is due on <span className={`font-semibold ${isPastDue ? 'text-red-600' : ''}`}>
                        {formattedDueDate}
                    </span>.
                    {isPastDue && (
                        <span className="text-red-600 font-bold ml-1">
                            Your payment is past due! Please make a payment immediately to avoid additional penalties.
                        </span>
                    )}

                    {!isPastDue && parseFloat(data?.penalty) > 0 && (
                        <span className="text-red-600 font-bold ml-1">
                            You have a penalty to pay! Please clear your penalty.
                        </span>
                    )}
                    {!isPastDue && !isPaymentPending && (
                        " Please ensure timely payment to avoid any penalties. Thank you."
                    )}
                </p>

                {/* Payment Processing Message */}
                {isPaymentPending && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm text-center font-medium">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                            Your payment is currently being processed. Please wait for approval before making another payment.
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-4 mt-6">
                    <motion.button
                        whileHover={!isPaymentPending ? { scale: 1.05 } : {}}
                        whileTap={!isPaymentPending ? { scale: 0.95 } : {}}
                        className={`w-full cursor-pointer transition font-semibold text-lg py-3 rounded-lg shadow-lg ${
                            isPaymentPending 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' 
                                : isPastDue 
                                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full border cursor-pointer border-gray-400 text-gray-700 py-3 rounded-lg shadow-md hover:bg-gray-100 transition font-semibold text-lg"
                    >
                        View Payment History
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default Step1;