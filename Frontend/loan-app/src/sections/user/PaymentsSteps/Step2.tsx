import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { motion } from "framer-motion";
import { useMyContext } from "../../../context/MyContext";
import { SubmitDisbursement } from "../../../constants/interfaces/disbursement";
import { useEffect } from "react";
import { userDisbursementApi } from "../../../services/axiosConfig";
import { useQueryClient } from "@tanstack/react-query";
interface Step2Props {
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  const { data } = useQuery(["userLoanSubmission2"], getLoanSubmission);
  const queryClient = useQueryClient();
  console.log(data)
  const [selectedOption, setSelectedOption] = useState<number | null>(
    () => JSON.parse(localStorage.getItem("selectedOption") || "null")
  );

  const { setDisbursement, disbursement, noOfPenaltyDelay, penalty, setPenalty } = useMyContext();

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
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        periodPayment: adjustedPaymentOptions[savedOptionIndex],
      }));
    }
  }, [data, setDisbursement]);

  const adjustedPaymentOptions = adjustPaymentOptions(balance);
  
  // Function to determine if an option should be disabled based on no_penalty_delay
  const isOptionDisabledDueToPenalty = (optionIndex: number) => {
    const noPenaltyDelay = data?.no_penalty_delay || noOfPenaltyDelay || 0;
    
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


  const totalWithPenalty = Math.round((roundedPaymentPerMonth * 0.10) * noOfPenaltyDelay);
  console.log(totalWithPenalty);

  useEffect(() => {


    setPenalty(totalWithPenalty);


    if (totalWithPenalty > 0) {
      const submitPenalty = async () => {
        try {

          const response = await userDisbursementApi.post('/penalty/', { penalty: totalWithPenalty, no_penalty_delay: noOfPenaltyDelay });

          if (response.status === 200) {
            queryClient.invalidateQueries(['userLoanSubmission2']);

          }

        } catch (error) {

        }
      };

      submitPenalty();
    }
  }, [totalWithPenalty, setPenalty]);



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
           
            const isDisabled = (option.disabled || 
              (index === 3 &&
              (adjustedPaymentOptions[0]?.amount === option.amount ||
                adjustedPaymentOptions[1]?.amount === option.amount ||
                adjustedPaymentOptions[2]?.amount === option.amount)) || 
              isOptionDisabledDueToPenalty(index));

            return (
              <div key={index}>
                <motion.div
                  className={`flex justify-between items-center px-4 py-3 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out
            ${disbursement.periodPayment?.label === option.label ? "border-blue-500 bg-blue-100" : "border-gray-300"}
            ${isDisabled ? "opacity-50 text-gray-400 cursor-not-allowed" : "hover:shadow-md"}`}
                  onClick={() => !isDisabled && handleSelectOption(index)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <span>{option.label}</span>
                  <span className="font-bold">
                    {formatCurrency(option.amount)}
                  </span>
                </motion.div>

             
                {index === 0 && (
                  <p className="flex text-lg justify-center items-center text-gray-500 mt-2"> Pay in advance</p>
                )}

                {index === 2 && (
                  <p className="flex text-lg justify-center items-center text-gray-500 mt-2"> Or</p>
                )}

          
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


        {
          parseFloat(data?.penalty) > 0 && (
            <div className="mt-6 p-4 border border-red-500 rounded-lg bg-red-100">
              <span className="font-semibold text-red-600">Total Penalty:</span>
              <span className="font-bold ml-2 text-red-600">
              {formatCurrency(data?.penalty || 0)} 
{data?.no_penalty_delay > 0 && ` (${data.no_penalty_delay} ${data.no_penalty_delay === 1 ? "month" : "months"} delayed)`}
              </span>
            </div>

          )
        }

        {/* Display payment restriction message based on penalty delay */}
        {(data?.no_penalty_delay > 0 || noOfPenaltyDelay > 0) && (
          <div className="mt-4 p-3 border border-orange-300 rounded-lg bg-orange-50">
            <span className="font-semibold text-orange-700">
              {(data?.no_penalty_delay > 3 || noOfPenaltyDelay > 3) 
                ? "Due to multiple months of delayed payments, only full payment is available."
                : `Due to ${data?.no_penalty_delay || noOfPenaltyDelay} ${(data?.no_penalty_delay === 1 || noOfPenaltyDelay === 1) ? "month" : "months"} of delayed payments, some payment options are restricted.`}
            </span>
          </div>
        )}


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