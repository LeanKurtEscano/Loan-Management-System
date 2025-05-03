import React from "react";
import { motion } from "framer-motion";
import { useMyContext } from "../../../context/MyContext";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatDateWithWords } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getPayments } from "../../../services/user/disbursement";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Make sure this is imported
import { useMemo } from "react";
interface Step1Props {
    nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ nextStep }) => {

    const { penalty, setPenalty, noOfPenaltyDelay, setNoOfPenaltyDelay } = useMyContext();
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

    console.log(data);

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

        return start.toISOString().split("T")[0]; // Return raw date for comparison
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

        return nextDate.toISOString().split("T")[0]; // Return raw date for comparison
    };

    {/* for testing    const forcePastDue = true;     if (forcePastDue) return true */ }
    const calculatePastDueAndDelay = (dueDateString: string) => {
        if (dueDateString === "N/A" || dueDateString === "Invalid Frequency") {
            return { isPastDue: false, monthsOverdue: 0 };
        }

        const today = new Date("2025-08-04");
        today.setHours(0, 0, 0, 0); // Reset time for today 2025-08-02

        const dueDate = new Date(dueDateString);
        dueDate.setHours(0, 0, 0, 0); // Reset time for due date

        if (today < dueDate) {
            return { isPastDue: false, monthsOverdue: 0 }; // Not overdue
        }

        // Calculate months overdue (MONTHLY ONLY)
        const monthsOverdue =
            (today.getFullYear() - dueDate.getFullYear()) * 12 +
            (today.getMonth() - dueDate.getMonth());

        // If today is before the due date of this month, no overdue months
        if (today.getDate() < dueDate.getDate()) {
            return { isPastDue: false, monthsOverdue: 0 };
        }
        console.log(monthsOverdue);

        // Otherwise, calculate overdue months
        return { isPastDue: true, monthsOverdue };
    };



    const totalPayment = data?.total_payment || "0";
    const balance = data?.balance || "0";
    const progressPercentage = totalPayment > 0 ? ((totalPayment - balance) / totalPayment) * 100 : 0;

    // Get raw due date for comparison
    const rawDueDate = Array.isArray(dataDate) && dataDate.length > 0
        ? getDueDateFromPeriod(data?.start_date, dataDate.map((payment: { period: string }) => payment.period))
        : getNextPaymentDate(data?.start_date, data?.frequency);

    // Check if payment is past due


    // Format date for display
    const formattedDueDate = rawDueDate !== "N/A" && rawDueDate !== "Invalid Frequency"
        ? formatDateWithWords(rawDueDate)
        : rawDueDate;


    // Memoize the calculation to avoid recomputing on every render
    const { isPastDue, monthsOverdue } = useMemo(() =>
        calculatePastDueAndDelay(rawDueDate),
        [rawDueDate]
    );



    useEffect(() => {
        if (isPastDue) {
            setPenalty(true);
            setNoOfPenaltyDelay(monthsOverdue); // Update penalty count
        } else {
            setPenalty(false);
            setNoOfPenaltyDelay(0); // Reset if not overdue
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
                    {!isPastDue && (
                        " Please ensure timely payment to avoid any penalties. Thank you."
                    )}
                </p>

                <div className="flex flex-col gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full cursor-pointer ${isPastDue ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 rounded-lg shadow-lg transition font-semibold text-lg`}
                        onClick={nextStep}
                    >
                        {isPastDue ? 'Make Overdue Payment Now' : 'Make a Payment'}
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