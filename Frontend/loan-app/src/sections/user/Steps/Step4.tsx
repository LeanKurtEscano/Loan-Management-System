import React from "react";
import { useMyContext } from "../../../context/MyContext";
import { useNavigate } from "react-router-dom";
import { sendLoanApplication } from "../../../services/user/loan";

const Step4 = ({ prevStep }: { prevStep: () => void }) => {
  const { loanApplication } = useMyContext();
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await sendLoanApplication(loanApplication);

      if (response.status === 201) {
        sessionStorage.clear();
        nav("/user/my-loan");
      }
    } catch (error: any) {
      console.log("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 pb-10 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-wide">
        Review Your Loan Application
      </h1>

      {/* Summary Card */}
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 space-y-6">

        {/* ID Images Section */}
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Identification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanApplication.front && (
            <div className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-4">
              <span className="font-medium text-gray-600 mb-2">Front ID</span>
              <img
                src={URL.createObjectURL(loanApplication.front)}
                alt="Front ID"
                className="w-full h-56 object-cover rounded-md"
              />
            </div>
          )}
          {loanApplication.back && (
            <div className="flex flex-col items-center bg-gray-100 shadow-md rounded-lg p-4">
              <span className="font-medium text-gray-600 mb-2">Back ID</span>
              <img
                src={URL.createObjectURL(loanApplication.back)}
                alt="Back ID"
                className="w-full h-56 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Section: Personal Information */}
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-600">ID Type:</strong> {loanApplication.idType}
          </p>
          <p>
            <strong className="text-gray-600">Education Level:</strong> {loanApplication.educationLevel}
          </p>
        </div>

        {/* Section: Income Information */}
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-4">
          Income Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-600">Employment Status:</strong> {loanApplication.employmentStatus}
          </p>
          <p>
            <strong className="text-gray-600">Monthly Income:</strong> ₱{loanApplication.monthlyIncome}
          </p>
          <p>
            <strong className="text-gray-600">Income Variation:</strong> {loanApplication.incomeVariation}
          </p>
          <p>
            <strong className="text-gray-600">Primary Income Source:</strong> {loanApplication.primaryIncomeSource}
          </p>
          <p className="col-span-2">
            <strong className="text-gray-600">Other Sources of Income:</strong>{" "}
            {loanApplication.otherSourcesOfIncome.length > 0
              ? loanApplication.otherSourcesOfIncome.join(", ")
              : "None"}
          </p>
          <p>
            <strong className="text-gray-600">Income Frequency:</strong>{" "}
            {loanApplication.incomeFrequency}
          </p>
          <p>
            <strong className="text-gray-600">Primary Source of Income:</strong>{" "}
            {loanApplication.primarySource}
          </p>
          <p className="col-span-2">
            <strong className="text-gray-600">Average Money Received:</strong>{" "}
            ₱{loanApplication.moneyReceive}
          </p>
        </div>

        {/* Section: Expenses and Loan Purpose */}
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-4">
          Expenses & Loan Purpose
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-600">Total Spend (last 30 days):</strong> ₱{loanApplication.totalSpend}
          </p>
          <p>
            <strong className="text-gray-600">Outstanding Loans:</strong> {loanApplication.outstanding}
          </p>
          <p className="col-span-2">
            <strong className="text-gray-600">Purpose of Loan:</strong> {loanApplication.purpose}
          </p>
          <p className="col-span-2">
            <strong className="text-gray-600">Detailed Explanation:</strong> {loanApplication.explanation}
          </p>
        </div>


        <div className="flex justify-between mt-6">

          <button
            onClick={prevStep}
            className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-medium py-2 px-8 text-lg rounded-lg shadow-sm transition ease-in-out duration-300"
          >
            Back
          </button>


          <button
            onClick={handleSubmit}
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-semibold py-3 px-10 text-lg rounded-lg shadow-md transition ease-in-out duration-300"
          >
            Submit Application
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step4;
