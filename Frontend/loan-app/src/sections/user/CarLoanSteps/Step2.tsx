import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { motion } from "framer-motion";
import { useCarContext } from "../../../context/CarContext";
import { SubmitDisbursement } from "../../../constants/interfaces/disbursement";
import { useEffect } from "react";
import { userDisbursementApi } from "../../../services/axiosConfig";
import { useQueryClient } from "@tanstack/react-query";

import { fetchCarLoanDisbursement } from "../../../services/rental/carDisbursement";
interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  const { data } = useQuery(["userCarLoanStep2"], fetchCarLoanDisbursement);
  const queryClient = useQueryClient();
  console.log(data)
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => JSON.parse(localStorage.getItem("selectedOption") || "null")
  );

  const { setCarDisbursement, carDisbursement, carNoOfPenaltyDelay, carPenalty, setCarPenalty } = useCarContext();

  const totalPayment = parseFloat(data?.total_amount || "0");
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
    return Math.ceil(balance / monthlyPayment); 
  };

  const remainingMonths = getRemainingMonths(balance, paymentPerMonth);




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
      amount: roundedPaymentPerMonth * 3,
      duration: 3,
    },
    {
      label: `Pay in full (${remainingMonths} ${remainingMonths !== 1 ? "months" : "month"})`,
      amount: data?.balance,
      duration: remainingMonths,
    },
  ];

  const adjustPaymentOptions = (balance: number) => {
    const maxDiscrepancy = 0.09;
    let remainingBalance = balance;

    return paymentOptions.map((option) => {
      const discrepancy = Math.abs(option.amount - remainingBalance);

      if (discrepancy <= maxDiscrepancy) {
        return {
          ...option,
          amount: remainingBalance,
          disabled: false,
        };
      } else if (option.amount > remainingBalance) {

        return {
          ...option,
          disabled: true,
        };
      } else {

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
      setCarDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: adjustedPaymentOptions[savedOptionIndex],
      }));
    }
  }, [data, setCarDisbursement]);

  const adjustedPaymentOptions = adjustPaymentOptions(balance);
  
  // Function to determine if an option should be disabled based on no_penalty_delay
  const isOptionDisabledDueToPenalty = (optionIndex: number) => {
    const noPenaltyDelay = data?.no_penalty_delay || carNoOfPenaltyDelay || 0;
    
    // If no_penalty_delay is null or 0, all options are available
    if (!noPenaltyDelay || noPenaltyDelay === 0) {
      return false;
    }
    
    // If no_penalty_delay is greater than 3, only full payment (index 3) is available
    if (noPenaltyDelay > 3) {
      return optionIndex !== 3;
    }
    
    // If no_penalty_delay is 2, options 2 and 3 are available (2 months and full payment)
    if (noPenaltyDelay === 2) {
      return optionIndex < 1;
    }
    
    // If no_penalty_delay is 3, only option 2 and 3 are available (3 months and full payment)
    if (noPenaltyDelay === 3) {
      return optionIndex < 2;
    }
    
    // If no_penalty_delay is 1, options 1, 2, and 3 are available (all options)
    return false;
  };

  const handleProceed = () => {
    if (selectedOption === null) return;
    nextStep();
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption === index) {

      setSelectedOption(null);
      localStorage.removeItem("selectedOption");
      setCarDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: null,
      }));
    } else {

      setSelectedOption(index);
      localStorage.setItem("selectedOption", JSON.stringify(index));
      const selectedPayment = adjustedPaymentOptions[index];
      setCarDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: selectedPayment,
      }));
    }
  };


  const totalWithPenalty = Math.round((roundedPaymentPerMonth * 0.10) * carNoOfPenaltyDelay);
  console.log(totalWithPenalty);

  useEffect(() => {


    setCarPenalty(totalWithPenalty);


    if (totalWithPenalty > 0) {
      const submitPenalty = async () => {
        try {

          const response = await userDisbursementApi.post('/penalty/', { penalty: totalWithPenalty, no_penalty_delay: carNoOfPenaltyDelay });

          if (response.status === 200) {
            queryClient.invalidateQueries(['userLoanSubmission2']);

          }

        } catch (error) {

        }
      };

      submitPenalty();
    }
  }, [totalWithPenalty, setCarPenalty]);



  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Please select the amount you wish to pay and proceed with the payment.
            </h2>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.2 }}
            >
              {adjustedPaymentOptions.map((option, index) => {
               
                const isDisabled = (option.disabled || 
                  (index === 3 &&
                  (adjustedPaymentOptions[0]?.amount === option.amount ||
                    adjustedPaymentOptions[1]?.amount === option.amount ||
                    adjustedPaymentOptions[2]?.amount === option.amount)) || 
                  isOptionDisabledDueToPenalty(index));

                return (
                  <div key={index}>
                    <motion.div
                      className={`flex justify-between items-center px-6 py-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                ${carDisbursement.periodPayment?.label === option.label ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300"}
                ${isDisabled ? "opacity-50 text-gray-400 cursor-not-allowed bg-gray-50" : "hover:shadow-lg hover:bg-gray-50"}`}
                      onClick={() => !isDisabled && handleSelectOption(index)}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <span className="text-lg font-medium text-gray-700">{option.label}</span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(option.amount)}
                      </span>
                    </motion.div>

                 
                    {index === 0 && (
                      <div className="flex justify-center mt-3 mb-4">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Pay in advance
                        </span>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="flex justify-center mt-4 mb-4">
                        <span className="text-lg font-medium text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                          Or
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Balance Information */}
            <div className="mt-8 p-6 border-2 border-gray-300 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Remaining Balance:</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(balance)}</span>
              </div>
            </div>

            {/* Penalty Information */}
            {parseFloat(data?.penalty) > 0 && (
              <div className="mt-6 p-6 border-2 border-red-300 rounded-xl bg-red-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-red-700">Total Penalty:</span>
                  <span className="text-xl font-bold text-red-700">
                    {formatCurrency(data?.penalty || 0)} 
                    {data?.no_penalty_delay > 0 && (
                      <span className="text-sm font-normal ml-2">
                        ({data.no_penalty_delay} {data.no_penalty_delay === 1 ? "month" : "months"} delayed)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Restriction Message */}
            {(data?.no_penalty_delay > 0 || carNoOfPenaltyDelay > 0) && (
              <div className="mt-6 p-5 border-2 border-orange-300 rounded-xl bg-orange-50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-orange-700 leading-relaxed">
                    {(data?.no_penalty_delay > 3 || carNoOfPenaltyDelay > 3) 
                      ? "Due to multiple months of delayed payments, only full payment is available."
                      : `Due to ${data?.no_penalty_delay || carNoOfPenaltyDelay} ${(data?.no_penalty_delay === 1 || carNoOfPenaltyDelay === 1) ? "month" : "months"} of delayed payments, some payment options are restricted.`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center space-x-4">
              <button
                className="flex-1 max-w-[140px] bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-lg font-medium transition-colors duration-200"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                className={`flex-1 max-w-[140px] px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                  selectedOption !== null 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleProceed}
                disabled={selectedOption === null}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;