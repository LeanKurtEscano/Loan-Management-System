import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { motion } from "framer-motion";
import { useMyContext } from "../../../context/MyContext";
import { SubmitDisbursement } from "../../../constants/interfaces/disbursement";
import { useEffect } from "react";

interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  const { data } = useQuery(["userLoanSubmission2"], getLoanSubmission);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => JSON.parse(localStorage.getItem("selectedOption") || "null")
  );

  const { setDisbursement, disbursement, penalty } = useMyContext();

  const totalPayment = parseFloat(data?.total_payment || "0");
  const balance = parseFloat(data?.balance || "0");

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
    return numPeriods > 0 ? totalPayment / numPeriods : 0;
  };

  const paymentPerMonth = getPaymentPerPeriod(totalPayment, data?.start_date, data?.repay_date, data?.frequency);

  const roundedPaymentPerMonth = paymentPerMonth;


  const getRemainingMonths = (balance: number, monthlyPayment: number) => {
    if (monthlyPayment === 0) return 0;
    return Math.ceil(balance / monthlyPayment); // Use Math.ceil to round up to the next full month
  };

  const remainingMonths = getRemainingMonths(balance, paymentPerMonth);
  const calculatePenaltyAmount = (baseAmount: number) => {
    return baseAmount + baseAmount * 0.10; // Add 10%
  };


  const calculatePenalty = (baseAmount: number) => {
    return  baseAmount * 0.10; // Add 10%
  };

  const paymentOptions = [
    {
      label: `1 ${data?.frequency.toLowerCase() === "monthly" ? "month" : "year"}`,
      amount: roundedPaymentPerMonth,
      duration: 1,
    },
    {
      label: `2 ${data?.frequency.toLowerCase() === "monthly" ? "months" : "years"}`,
      amount: roundedPaymentPerMonth * 2,
      duration: 2,
    },
    {
      label: `3 ${data?.frequency.toLowerCase() === "monthly" ? "months" : "years"}`,
      amount:  roundedPaymentPerMonth * 3,
      duration: 3,
    },
    {
      label: `Pay in full (${remainingMonths} ${remainingMonths !== 1 ? "months" : "month"})`,
      amount: data?.balance,
      duration: remainingMonths,
    },
  ];

  const adjustPaymentOptions = (balance: number) => {
    const maxDiscrepancy = 0.09;  // Maximum allowable discrepancy
    let remainingBalance = balance;

    return paymentOptions.map((option) => {
      const discrepancy = Math.abs(option.amount - remainingBalance);

      if (discrepancy <= maxDiscrepancy) {
        // If the option is within the acceptable discrepancy range, adjust the option
        return {
          ...option,
          amount: remainingBalance,  // Adjust to match the remaining balance
          disabled: false,  // Allow selection
        };
      } else if (option.amount > remainingBalance) {
        // If the option is greater than the balance, disable it
        return {
          ...option,
          disabled: true,
        };
      } else {
        // If the option is not close enough to the remaining balance, keep it selectable
        return {
          ...option,
          disabled: false,
        };
      }
    });
  };

  useEffect(() => {
    const savedOptionIndex = JSON.parse(localStorage.getItem("selectedOption") || "null");
    if (savedOptionIndex !== null) {
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: adjustedPaymentOptions[savedOptionIndex],
      }));
    }
  }, [data, setDisbursement]);



  // Adjust options based on the balance
  const adjustedPaymentOptions = adjustPaymentOptions(balance);
  const handleProceed = () => {
    if (selectedOption === null) return;
    nextStep();
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption === index) {

      setSelectedOption(null);
      localStorage.removeItem("selectedOption");
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: null,
      }));
    } else {

      setSelectedOption(index);
      localStorage.setItem("selectedOption", JSON.stringify(index));
      const selectedPayment = adjustedPaymentOptions[index];
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: selectedPayment,
      }));
    }
  };


  return (
    <div className="flex flex-co pt-16 items-center justify-center min-h-screen pb-28">
      <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-300 w-full ">
        <h2 className="text-center text-lg font-semibold mb-4">
          Please select the amount you wish to pay and proceed with the payment.
        </h2>
        <motion.div
  className="space-y-4"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }}
>
  {adjustedPaymentOptions.map((option, index) => {
    // Disable index 3 if its amount equals index 0, 1, or 2's amount
    const isDisabled = index === 3 && 
      (adjustedPaymentOptions[0]?.amount === option.amount || 
       adjustedPaymentOptions[1]?.amount === option.amount || 
       adjustedPaymentOptions[2]?.amount === option.amount);

    return (
      <div key={index}>
        <motion.div
          className={`flex justify-between items-center px-4 py-3 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out
            ${disbursement.periodPayment?.label === option.label ? "border-blue-500 bg-blue-100" : "border-gray-300"}
            ${option.disabled || isDisabled ? "opacity-50 text-gray-400 cursor-not-allowed" : "hover:shadow-md"}`}
          onClick={() => !option.disabled && !isDisabled && handleSelectOption(index)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span>{option.label}</span>
          <span className="font-bold">
            {penalty && index !== 3 ? (
              <>
                {formatCurrency(option.amount)}
                <span className="text-red-500 ml-2">
                  + Penalty (
                  {formatCurrency(
                    calculatePenalty(option.amount)
                  )}
                  )
                </span>
              </>
            ) : (
              formatCurrency(option.amount)
            )}
          </span>
        </motion.div>

        {/* Show message below the first option */}
        {index === 0 && (
          <p className="flex text-lg justify-center items-center text-gray-500 mt-2"> Pay in advance</p>
        )}

        {index === 2 && (
          <p className="flex text-lg justify-center items-center text-gray-500 mt-2"> Or</p>
        )}

        {/* Add a separator for all items except the last one */}
        {index !== adjustedPaymentOptions.length - 1 && (
          <hr className="my-3 border-gray-300" />
        )}
      </div>
    );
  })}
</motion.div>


        <div className="mt-6 p-4 border border-gray-400 rounded-lg bg-gray-100">
          <span className="font-semibold">Remaining Balance:</span>
          <span className="font-bold ml-2">{formatCurrency(balance)}</span>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold ${selectedOption !== null ? "bg-blue-500 cursor-pointer hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            onClick={handleProceed}
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
