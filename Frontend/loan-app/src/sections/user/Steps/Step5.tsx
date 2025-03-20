import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLoanData } from "../../../services/user/loan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";
import { useMyContext } from "../../../context/MyContext";
import {
  faHandHoldingUsd,
  faCoins,
  faPiggyBank,
  faCreditCard,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: { [key: string]: any } = {
  "6.00": faHandHoldingUsd,
  "8.00": faCoins,
  "10.00": faPiggyBank,
  "12.00": faCreditCard,
  "15.00": faWallet,
};

const Step5 = ({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    Number(sessionStorage.getItem("plan")) || null
  );
  const { loanApplication, setLoanApplication } = useMyContext();
  const loanPlansQuery = useQuery({
    queryKey: ["loanPlans"],
    queryFn: () => fetchLoanData("plans"),
  });

  const handleSelect = (id: number,interest: string, term: string, frequency: string) => {
    const formattedText = `${interest}% Interest ${term} months | ${frequency}`;
    setSelectedPlanId(id);
    setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, plan: id }));
    sessionStorage.setItem("plan", id.toString());
    sessionStorage.setItem("userPlan",formattedText);
  };

  useEffect(() => {
    if (selectedPlanId && !loanApplication.plan) {
      setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, plan: selectedPlanId }));
    }
  }, [selectedPlanId, loanApplication.plan]);

  return (
    <div className="flex items-start pl-44 max-w-6xl justify-center h-screen">
      <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Select Your Loan Plan</h1>

        
        {loanPlansQuery.isLoading && <p>Loading loan plans...</p>}
        {loanPlansQuery.isError && <p>Error loading loan plans.</p>}

        <div className="grid grid-cols-2 gap-4  ">
          {loanPlansQuery.data?.map((plan: { id: number; interest: string; repayment_term: number; payment_frequency: string; }) => (
            <div
              key={plan.id}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl shadow-md cursor-pointer transition-all ${
                selectedPlanId === plan.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-blue-100"
              }`}
              onClick={() => handleSelect(plan.id,plan.interest, plan.repayment_term.toString(), plan.payment_frequency )}
            >
              <FontAwesomeIcon
                icon={iconMap[plan.interest] || faCoins}
                className={`text-3xl ${
                  selectedPlanId === plan.id ? "text-white" : "text-blue-500"
                }`}
              />
              <h2
                className={`mt-2 font-medium ${
                  selectedPlanId === plan.id ? "text-white" : "text-gray-700"
                }`}
              >
                {plan.interest}% Interest
              </h2>
              <p
                className={`text-sm ${
                  selectedPlanId === plan.id ? "text-white" : "text-gray-600"
                }`}
              >
                {plan.repayment_term} months | {plan.payment_frequency}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="bg-blue-500 cursor-pointer text-white text-lg px-6 py-3 rounded-xl hover:bg-blue-600 transition w-[45%]"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={selectedPlanId === null}
            className={`text-lg px-6 py-3 cursor-pointer rounded-xl transition w-[45%] ${
              selectedPlanId === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
