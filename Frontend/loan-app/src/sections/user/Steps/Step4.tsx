import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLoanData } from "../../../services/user/loan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMyContext } from "../../../context/MyContext";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";
import {
  faUser,
  faBriefcase,
  faGraduationCap,
  faCar,
  faHome,

} from "@fortawesome/free-solid-svg-icons";

// Icon mapping
const iconMap: { [key: string]: any } = {
  "Personal Loan": faUser,
  "Business Loan": faBriefcase,
  "Educational Loan": faGraduationCap,
  "Car Loan": faCar,
  "Mortgage Loan": faHome,

};

const Step4 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(
    Number(sessionStorage.getItem("type")) || null
  );

  const { loanApplication, setLoanApplication } = useMyContext();

  const loanTypesQuery = useQuery({
    queryKey: ["loanTypes"],
    queryFn: () => fetchLoanData("types"),
  });

  console.log(loanTypesQuery.data);

  const handleSelect = (id: number, type: string) => {
    setSelectedLoanId(id);
    setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, type: id }));
    sessionStorage.setItem("type", id.toString());
    sessionStorage.setItem("userType", type);
  };
  const storedType = Number(sessionStorage.getItem("type"));
  useEffect(() => {
   
    if (storedType && !loanApplication.type) {
      setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, type: storedType }));
      setSelectedLoanId(storedType);
    }
  }, [selectedLoanId, loanApplication.type]);

  return (
    <div className="flex items-start max-w-6xl pl-44 justify-center h-screen">
      <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Select Your Loan Type</h1>

        {loanTypesQuery.isLoading && <p>Loading loan types...</p>}
        {loanTypesQuery.isError && <p>Error loading loan types.</p>}

        <div className="grid grid-cols-2 gap-4">
          {loanTypesQuery.data?.map((type: { id: number; name: string }) => (
            <div
              key={type.id}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl shadow-md cursor-pointer transition-all ${
                selectedLoanId === type.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 hover:bg-blue-100"
              }`}
              onClick={() => handleSelect(type.id, type.name)}
            >
              <FontAwesomeIcon
                icon={iconMap[type.name] || faUser}
                className={`text-3xl ${
                  selectedLoanId === type.id ? "text-white" : "text-blue-500"
                }`}
              />
              <h2
                className={`mt-2 font-medium ${
                  selectedLoanId === type.id ? "text-white" : "text-gray-700"
                }`}
              >
                {type.name}
              </h2>
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
            disabled={selectedLoanId === null}
            className={`text-lg px-6 py-3 cursor-pointer rounded-xl transition w-[45%] ${
              selectedLoanId === null
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

export default Step4;
