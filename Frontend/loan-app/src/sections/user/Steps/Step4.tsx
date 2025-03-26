import React, { useState } from "react";
import { useMyContext } from "../../../context/MyContext";
import { useNavigate } from "react-router-dom";
import { sendLoanApplication } from "../../../services/user/loan";

const Step4 = ({ prevStep }: { prevStep: () => void }) => {
  const { loanApplication } = useMyContext();
  const nav = useNavigate();
  const [loading,setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await sendLoanApplication(loanApplication);

      if (response.status === 201) {
        sessionStorage.clear();
        setLoading(false)
        nav("/user/my-loan");
      }
    } catch (error: any) {
      setLoading(false);
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
          {loading ? (
                            <>
                                <svg aria-hidden="true" className="w-6 h-7  text-slate-200 animate-spin dark:text-slate-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>

                            </>
                        ) : (
                            "Submit Application"
                        )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step4;
