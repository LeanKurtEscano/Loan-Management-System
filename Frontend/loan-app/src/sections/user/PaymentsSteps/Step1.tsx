import React from "react";
import { motion } from "framer-motion";
import { useMyContext } from "../../../context/MyContext";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatDateWithWords } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getPayments } from "../../../services/user/disbursement";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react"; 
import { useMemo } from "react";
import { reminderNotification } from "../../../services/user/notification";

interface Step1Props {
    nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ nextStep }) => {

    const getCurrentDate = () => {
        // Toggle this for testing
        const IS_TESTING = true;
        //'2025-08-8'
        if (IS_TESTING) {
            return new Date();
        }
        
        return new Date();
    };

    const { setPenalty, setNoOfPenaltyDelay } = useMyContext();
    
    const sentNotifications = useRef<Set<string>>(new Set());
    const isInitialized = useRef(false);

    const { data, isLoading, isError } = useQuery(
        ['userLoanSubmission1'],
        getLoanSubmission
    );
    const navigate = useNavigate();
    

    const createNotificationKey = (dueDate: string, notificationType: string) => {
        const todayString = getCurrentDate().toISOString().split("T")[0]; // e.g. '2025-08-08'
        return `${data?.user_id || 'unknown'}_${data?.loan_id || 'unknown'}_${dueDate}_${notificationType}_${todayString}`;
    };

    
    // Check if notification was already sent
    const wasNotificationSent = (dueDate: string, notificationType: string) => {
        const key = createNotificationKey(dueDate, notificationType);
        return sentNotifications.current.has(key);
    };

    // Mark notification as sent
    const markNotificationAsSent = (dueDate: string, notificationType: string) => {
        const key = createNotificationKey(dueDate, notificationType);
        sentNotifications.current.add(key);
        
        // Store in localStorage for persistence across sessions
        try {
            const storedNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '[]');
            const newNotification = {
                key,
                timestamp: new Date().toISOString(),
                dueDate,
                notificationType,
                userId: data?.user_id,
                loanId: data?.loan_id
            };
            
            // Check if this notification already exists
            const existingIndex = storedNotifications.findIndex((n: any) => n.key === key);
            if (existingIndex === -1) {
                storedNotifications.push(newNotification);
                // Keep only last 100 notifications to prevent localStorage bloat
                const recentNotifications = storedNotifications.slice(-100);
                localStorage.setItem('sentNotifications', JSON.stringify(recentNotifications));
            }
        } catch (error) {
            console.error('Failed to store notification in localStorage:', error);
        }
    };

    // Load previously sent notifications and clean up old ones
    const initializeNotifications = () => {
        try {
            const storedNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '[]');
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            
            // Filter out notifications older than 1 day
            const recentNotifications = storedNotifications.filter((notification: { timestamp: string }) => {
                const notificationDate = new Date(notification.timestamp);
                return notificationDate > oneDayAgo;
            });
            
            // Update localStorage with cleaned data
            localStorage.setItem('sentNotifications', JSON.stringify(recentNotifications));
            
            // Populate in-memory set with recent notifications
            sentNotifications.current.clear();
            recentNotifications.forEach((notification: { key: string }) => {
                sentNotifications.current.add(notification.key);
            });
            
            console.log('📋 Loaded sent notifications:', recentNotifications.length);
        } catch (error) {
            console.error('Failed to load notifications from localStorage:', error);
        }
    };

    // Initialize notifications on component mount
    useEffect(() => {
        if (!isInitialized.current) {
            initializeNotifications();
            isInitialized.current = true;
        }
    }, []);

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

    // Function to check if it's time to send reminder (1 or 2 days before due date)
    const checkReminderDate = (dueDateString: string) => {
        if (dueDateString === "N/A" || dueDateString === "Invalid Frequency") {
            return { shouldSendReminder: false, daysUntilDue: null };
        }

        const today = getCurrentDate();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dueDateString);
        dueDate.setHours(0, 0, 0, 0);

        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Send reminder if it's 1 or 2 days before due date
        const shouldSendReminder = daysDiff === 1 || daysDiff === 2;

        return { shouldSendReminder, daysUntilDue: daysDiff };
    };

    // Function to get days until due date (for additional info)
    const getDaysUntilDue = (dueDateString: string) => {
        if (dueDateString === "N/A" || dueDateString === "Invalid Frequency") {
            return null;
        }

        const today = getCurrentDate();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dueDateString);
        dueDate.setHours(0, 0, 0, 0);

        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysDiff;
    };

    const calculatePastDueAndDelay = (dueDateString: string) => {
        if (dueDateString === "N/A" || dueDateString === "Invalid Frequency") {
            return { isPastDue: false, monthsOverdue: 0 };
        }
    
        const today = getCurrentDate();
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

    // Check if payment is pending or processing
    const isPaymentPending = data?.payment_status === "Pending";

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

    // Check if it's time to send reminder (1 or 2 days before due date)
    const { shouldSendReminder, daysUntilDue } = useMemo(() =>
        checkReminderDate(rawDueDate),
        [rawDueDate]
    );

    console.log('Debug Info:', {
        rawDueDate,
        isPastDue,
        shouldSendReminder,
        daysUntilDue,
        isPaymentPending,
        isInitialized: isInitialized.current,
        notificationAlreadySent: rawDueDate !== "N/A" && daysUntilDue !== null ? 
            wasNotificationSent(rawDueDate, `payment_reminder_${daysUntilDue}_days`) : false
    });

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

    // Effect to handle reminder notifications (1 or 2 days before due date)
    useEffect(() => {
        // Only proceed if component is properly initialized
        if (!isInitialized.current || !data?.user_id || !data?.loan_id) {
            return;
        }

        if (shouldSendReminder && !isPastDue && !isPaymentPending && rawDueDate !== "N/A" && daysUntilDue !== null) {
            const notificationType = `payment_reminder_${daysUntilDue}_days`;
            
            // Check if notification was already sent for this specific day count
            if (wasNotificationSent(rawDueDate, notificationType)) {
                console.log(`🚫 Notification already sent for ${daysUntilDue} days before due date:`, rawDueDate);
                return;
            }
                          
            const sendNotification = async() => {
                try {
                    console.log(`📤 Sending ${daysUntilDue}-day reminder notification for due date:`, rawDueDate);
                    
                    const response = await reminderNotification(rawDueDate);
                    if(response.status === 200) {
                        markNotificationAsSent(rawDueDate, notificationType);
                        console.log(`✅ ${daysUntilDue}-day reminder notification marked as sent`);
                    }
                              
                } catch (error) {
                    console.error('❌ Error sending notification:', error);
                }
            };

            sendNotification();
        }
    }, [shouldSendReminder, isPastDue, isPaymentPending, data?.user_id, data?.loan_id, rawDueDate, daysUntilDue]);

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
                    </span> is due on <span className={`font-semibold ${isPastDue ? 'text-red-600' : shouldSendReminder ? 'text-yellow-600' : ''}`}>
                        {formattedDueDate}
                    </span>.
                    {isPastDue && (
                        <span className="text-red-600 font-bold ml-1">
                            Your payment is past due! Please make a payment immediately to avoid additional penalties.
                        </span>
                    )}
                    {shouldSendReminder && !isPastDue && daysUntilDue !== null && (
                        <span className="text-yellow-600 font-bold ml-1">
                            Payment due in {daysUntilDue} day{daysUntilDue > 1 ? 's' : ''}! Please prepare to make your payment on time.
                        </span>
                    )}
                    {!isPastDue && parseFloat(data?.penalty) > 0 && (
                        <span className="text-red-600 font-bold ml-1">
                            You have a penalty to pay! Please clear your penalty.
                        </span>
                    )}
                    {!isPastDue && !shouldSendReminder && !isPaymentPending && (
                        " Please ensure timely payment to avoid any penalties. Thank you."
                    )}
                </p>

                {/* Reminder warning message */}
                {shouldSendReminder && !isPastDue && !isPaymentPending && daysUntilDue !== null && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm text-center font-medium">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                            Payment reminder: Your payment is due in {daysUntilDue} day{daysUntilDue > 1 ? 's' : ''}. Please prepare to make your payment on time.
                        </p>
                    </div>
                )}

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
                                    : shouldSendReminder
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        onClick={isPaymentPending ? undefined : nextStep}
                        disabled={isPaymentPending}
                    >
                        {isPaymentPending 
                            ? 'Payment Processing...' 
                            : isPastDue 
                                ? 'Make Overdue Payment Now'
                                : shouldSendReminder && daysUntilDue !== null
                                    ? `Make Payment (Due in ${daysUntilDue} Day${daysUntilDue > 1 ? 's' : ''})`
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