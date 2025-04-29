import React, { useEffect, useState } from "react";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { getLoanApplication } from "../../../services/user/userData";
import { validateRepayDate } from "../../../utils/validation";
import PaymentBreakdownModal from "../../../components/PaymentBreakdownModal";

const Step3 = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const { loanSubmission, setLoanSubmission } = useMyContext();
  const [dateError, setDateError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "repayDate") {
      const error = validateRepayDate(value);
      setDateError(error);
    }

    setLoanSubmission((prev: LoanSubmission) => ({ ...prev, [name]: value }));
  };

  const { data } = useQuery(["userLoanApplication"], getLoanApplication);

  const serviceFee = data?.interest ? (loanSubmission.loanAmount * data.interest) / 100 : 0;
  const totalPayment = Number(loanSubmission.loanAmount) + Number(serviceFee);

  // Monthly Payment based on repayDate
  const getMonthlyPayment = () => {
    if (!loanSubmission.repayDate) return 0;
    const today = new Date();
    const repayDate = new Date(loanSubmission.repayDate);

    const differenceInMonths = (repayDate.getFullYear() - today.getFullYear()) * 12 + (repayDate.getMonth() - today.getMonth());

    const months = Math.max(differenceInMonths, 1); // At least 1 month
    return totalPayment / months;
  };

  const monthlyPayment = getMonthlyPayment();
  const penaltyFee = monthlyPayment * 0.1; // 10% of monthly payment

  useEffect(() => {
    setLoanSubmission((prev: LoanSubmission) => ({ ...prev, totalPayment: totalPayment }));
    localStorage.setItem("totalPayment", JSON.stringify(totalPayment));
  }, [totalPayment, setLoanSubmission]);

  const handleContinue = () => {
    const error = validateRepayDate(loanSubmission.repayDate);
    if (error) {
      setDateError(error);
      return;
    }

    nextStep();
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 180);
    return today.toISOString().split("T")[0];
  };

  const isMonthlyDisabled = () => {
    const selectedDate = new Date(loanSubmission.repayDate);
    const currentDate = new Date();
    const differenceInDays = (selectedDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    return differenceInDays < 30;
  };

  const isBreakdownDisabled = !loanSubmission.repayDate || !!dateError || !loanSubmission.paymentFrequency;

  return (
    <div className="flex items-center pt-24 justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-xl w-full max-w-lg text-center">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Choose When to Repay</h3>
        <p className="text-base mb-6 text-gray-600">Please select the date by which you plan to repay the loan.</p>

        <div className="mb-4">
          <label htmlFor="repayDate" className="block text-left text-sm font-medium text-gray-700 mb-1 ml-1">
            Repayment Date
          </label>
          <input
            id="repayDate"
            name="repayDate"
            type="date"
            value={loanSubmission.repayDate}
            onChange={handleChange}
            className={`border ${dateError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-700 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            min={getMinDate()}
          />
          {dateError && (
            <p className="text-left text-red-500 text-sm mt-1 ml-1">{dateError}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="paymentFrequency" className="block text-left text-sm font-medium text-gray-700 mb-1 ml-1">
            Payment Frequency
          </label>
          <select
            id="paymentFrequency"
            name="paymentFrequency"
            disabled={!loanSubmission.repayDate || !!dateError}
            value={loanSubmission.paymentFrequency || ""}
            onChange={handleChange}
            className={`border ${!loanSubmission.repayDate || dateError ? 'border-gray-200' : 'border-gray-300'} p-3 rounded-lg w-full text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${!loanSubmission.repayDate || dateError
                ? "bg-gray-100 cursor-not-allowed text-gray-400"
                : "bg-white cursor-pointer"
              }`}
          >
            <option value="">Select Payment Frequency</option>
            <option value="monthly" disabled={isMonthlyDisabled()}>Monthly</option>
          
          </select>
          {loanSubmission.repayDate && isMonthlyDisabled() && loanSubmission.paymentFrequency === "monthly" && (
            <p className="text-left text-amber-500 text-sm mt-1 ml-1">Monthly payments require at least 30 days until repayment</p>
          )}
        </div>

        <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 mt-4 shadow-sm">
          <h4 className="text-gray-800 font-medium mb-3 text-lg">Payment Summary</h4>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-600">Borrowed Amount:</p>
            <p className="font-semibold text-gray-800">{formatCurrency(loanSubmission.loanAmount)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-600">Service Fee (Interest):</p>
            <p className="font-semibold text-gray-800">{formatCurrency(serviceFee)}</p>
          </div>
          <div className="h-px bg-gray-200 my-3"></div>
          <div className="flex justify-between mb-3">
            <p className="text-base font-bold text-gray-800">Total Payment:</p>
            <p className="text-base font-bold text-blue-600">{formatCurrency(totalPayment)}</p>
          </div>

        </div>
        
        <button
          onClick={() => setShowModal(true)}
          disabled={isBreakdownDisabled}
          className={`mt-4 w-full ${
            isBreakdownDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold py-3 rounded-lg  cursor-pointer transition-all duration-200 shadow-sm`}
        >
          View Payment Breakdown
        </button>

        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={prevStep}
            className="flex-1 border cursor-pointer border-gray-300 rounded-lg py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            ← Go Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!loanSubmission.repayDate || !!dateError || !loanSubmission.paymentFrequency}
            className={`flex-1 ${
              !loanSubmission.repayDate || !!dateError || !loanSubmission.paymentFrequency
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium cursor-pointer rounded-lg py-3 transition-all duration-200 shadow-sm`}
          >
            Next →
          </button>
        </div>

        {showModal && (
          <PaymentBreakdownModal
          penaltyFee = {penaltyFee}
            monthlyPayment={monthlyPayment} 
            repayDate={loanSubmission.repayDate}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Step3;