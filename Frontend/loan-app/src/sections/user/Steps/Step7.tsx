import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faBriefcase, faDollarSign, faClipboardList, faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "../../../context/MyContext";
import { sendLoanApplication } from "../../../services/user/loan";
import { useNavigate } from "react-router-dom";
const Step7 = ({ prevStep }: { prevStep: () => void; }) => {
  const { loanApplication } = useMyContext();
  const nav = useNavigate();
  console.log(loanApplication);

  const formatCurrency = (amount: string) => {
    return `₱${parseFloat(amount).toLocaleString("en-PH")}`;
  };
  const handleSubmit = async() => {
     try {

      const response = await sendLoanApplication(loanApplication);

      if(response.status === 201) {
        sessionStorage.clear();
        nav('/my-loans');
      }

     } catch (error:any) {
       console.log("Something Wrong")
     }
  }

  const fields = [
    { label: "ID Number", value: loanApplication.idNumber, icon: faIdCard },
    { label: "Employment", value: loanApplication.employment, icon: faBriefcase },
    { label: "Income", value: loanApplication.income, icon: faPesoSign },
    { label: "Loan Type", value: sessionStorage.getItem("userType") || "Not selected", icon: faClipboardList },
    { label: "Plan", value: sessionStorage.getItem("userPlan") || "Not selected", icon: faClipboardList },
    { label: "Amount", value: formatCurrency(loanApplication.amount), icon: faPesoSign },
  ];

  return (
    <div className="flex items-center pt-44 justify-center mb-40 h-screen">
      <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-2xl font-bold text-center  text-gray-800">Review Your Application</h1>
        <p className="text-center text-gray-500 mb-7 ">Processing will take 3-5 business days.</p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg shadow-md">
              <FontAwesomeIcon icon={field.icon} className="text-blue-500 text-2xl" />
              <div>
                <h2 className="text-lg font-medium text-gray-700">{field.label}</h2>
                <p className="text-gray-600">{field.value}</p>
              </div>
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
            onClick={handleSubmit}
            className="bg-green-500 cursor-pointer text-white text-lg px-6 py-3 rounded-xl hover:bg-green-600 transition w-[45%]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step7;
