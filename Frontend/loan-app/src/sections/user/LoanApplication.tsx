import React from "react";
import ProgressBar from "../../components/ProgressBar";
import { useState } from "react";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLoanApplication } from "../../services/user/userData";

const LoanApplication: React.FC = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const { data, isLoading, isError } = useQuery(
    ["userLoanApplication"],
    getLoanApplication
  );

 
  console.log();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


  const applicationData = data ?? { status: "new" };

  return (
    <div className="mx-auto p-6 mb-7 bg-white rounded-lg shadow-lg">
      {applicationData?.status.trim() === "Pending" ? (
        <div className="flex flex-col items-center justify-center h-80 w-full bg-yellow-100 border border-yellow-300 rounded-lg shadow-md text-center">
          <FontAwesomeIcon
            icon={faHourglassHalf}
            className="text-gray-800 text-4xl animate-[spin_4s_linear_infinite] mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Loan Application Pending...</h2>
          <p className="text-lg mt-2 opacity-90">We’re reviewing your submission. Please hold tight!</p>
          <p className="text-sm mt-4 italic opacity-75">This may take up to 24 hours.</p>
        </div>

      ) : data?.status === "Approved" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center h-80 bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300 rounded-lg shadow-md p-4"
        >

          <Confetti numberOfPieces={450} recycle={false} />
          <span className="text-4xl bg-white items-center pl-1.5 rounded-full py-2 pr-0.5">
            🎉
          </span>
          <h2 className="text-4xl font-semibold text-white mt-2">
            Loan Application Approved!
          </h2>
          <p className="mt-2 font-semibold text-xl text-white">
            You're all set! Enjoy the benefits of your approved loan.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="mb-5 pl-24">
            <button
              onClick={() => nav("/")}
              className="md:left-40 cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-white" /> Go
              Back
            </button>
          </div>

          <div className="w-1/2 mx-auto flex items-center">
            <ProgressBar step={step} totalSteps={totalSteps} />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1 nextStep={nextStep} />}
            {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} />}
            {step === 4 && <Step4 prevStep={prevStep}  />}

          </motion.div>
        </>
      )}
    </div>
  );
};

export default LoanApplication;
