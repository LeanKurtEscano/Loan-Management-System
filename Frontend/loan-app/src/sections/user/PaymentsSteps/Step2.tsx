import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { motion } from "framer-motion";

interface Step2Props {
    nextStep: () => void;
    prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
    const { data, isLoading, isError } = useQuery(["userLoanSubmission"], getLoanSubmission);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Error fetching data</div>;

    const totalPayment = parseFloat(data?.total_payment || "0");
    const balance = parseFloat(data?.balance || "0");
    const testBalance = 20000
    const getPaymentPerPeriod = (totalPayment: number, startDate: string, endDate: string, frequency: string): number => {
        if (!totalPayment || !startDate || !endDate || !frequency) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);
        let numPeriods = 0;

        switch (frequency.toLowerCase()) {
            case "monthly":
                numPeriods = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                break;
            case "yearly":
                numPeriods = end.getFullYear() - start.getFullYear();
                break;
            default:
                return 0;
        }

        if (numPeriods <= 0) return 0;
        return totalPayment / numPeriods;
    };

    const paymentPerMonth = getPaymentPerPeriod(totalPayment, data?.start_date, data?.repay_date, data?.frequency);

    const paymentOptions = [
        { label: `1 ${data?.frequency.toLowerCase() === "monthly" ? "month" : "year"}`, amount: paymentPerMonth, duration: 1 },
        { label: `2 ${data?.frequency.toLowerCase() === "monthly" ? "months" : "years"}`, amount: paymentPerMonth * 2, duration: 2 },
        { label: `3 ${data?.frequency.toLowerCase() === "monthly" ? "months" : "years"}`, amount: paymentPerMonth * 3, duration: 3 }
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pb-28">
            <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-300 w-full max-w-md">
                <h2 className="text-center text-lg font-semibold mb-4">
                    Please select the amount you wish to pay and proceed with the payment.
                </h2>

                <motion.div className="space-y-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }}>
                    {paymentOptions.map((option, index) => {
                        const isDisabled = option.amount > balance;
                        return (
                            <motion.div
                                key={index}
                                className={`flex justify-between items-center px-4 py-3 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                                    selectedOption === index ? "border-blue-500" : "border-gray-300"
                                } ${isDisabled ? "opacity-50 text-gray-400  cursor-not-allowed" : "hover:shadow-md"}`}
                                onClick={() => !isDisabled && setSelectedOption(index)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <span>{option.label}</span>
                                <span className="font-bold">{formatCurrency(option.amount)}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="mt-6 p-4 border border-gray-400 rounded-lg bg-gray-100">
                    <span className="font-semibold">Remaining Balance:</span>
                    <span className="font-bold ml-2">{formatCurrency(balance)}</span>
                </div>

                <div className="flex justify-between mt-6">
                    <button className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg" onClick={prevStep}>
                        Back
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg text-lg font-semibold ${
                            selectedOption !== null ? "bg-blue-500 cursor-pointer hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        onClick={nextStep}
                        disabled={selectedOption === null}
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2;
