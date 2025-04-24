import React from 'react';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoanApplication } from '../../services/user/userData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoanSubmission } from '../../services/user/userData';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { PlusCircle, ChevronRight, DollarSign, Clock, Shield } from 'lucide-react';
import PaymentStep1 from './PaymentsSteps/Step1';
import PaymentStep2 from "./PaymentsSteps/Step2";
import PaymentStep3 from "./PaymentsSteps/Step3";
import PaymentStep4 from "./PaymentsSteps/Step4";
import Step1 from './LoanSteps/Step1';
import Step2 from './LoanSteps/Step2';
import Step4 from './LoanSteps/Step4';
import Step3 from './LoanSteps/Step3';
import Step5 from './LoanSteps/Step5';
import Step6 from './LoanSteps/Step6';

import Confetti from "react-confetti";
import { userDisbursementApi } from '../../services/axiosConfig';
const Loan: React.FC = () => {


  const queryClient = useQueryClient();
  const [isHovering, setIsHovering] = useState(false);


  const { data: loanSubmissions, isLoading: isSubLoading, isError: isSubError } = useQuery(
    ['userLoanSubmission'],
    getLoanSubmission
  );

  console.log(loanSubmissions)



  console.log(loanSubmissions)
  const { data, isLoading, isError } = useQuery(
    ['userLoanApplication2'],
    getLoanApplication
  );


  const showCelebration =
    loanSubmissions?.is_celebrate === true &&
    loanSubmissions?.status?.trim() !== "Pending"


  const totalSteps = 6;

  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


  const nav = useNavigate();

  const goApply = () => {
    nav('/user/apply-loan')
  }



  const applicationSubmission = loanSubmissions ?? { status: 'new' };
  const applicationData = data ?? { status: 'new' };

  const handleClick = async () => {

    try {

      const response = await userDisbursementApi.post("/new/application/", {})
      if (response.status === 200) {
        queryClient.invalidateQueries(["userLoanSubmission"])
        queryClient.invalidateQueries(["userLoanApplication"])
        queryClient.invalidateQueries(["userLoanApplication2"])
        nav('/user/apply-loan');

      }

    } catch (error) {
      alert("Network error");
    }

  };


  return (
    <section className="flex flex-col items-center w-full  mb-36 bg-white text-gray-800 p-4">

      {/*  : applicationSubmission?.is_celebrate !== "false" ? (


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mt-20 justify-center w-1/2 h-80 bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300 rounded-lg shadow-md p-4"
        >
          <Confetti numberOfPieces={450} recycle={false} />



          <span className="text-4xl bg-white items-center pl-1.5 rounded-full py-2 pr-0.5">
            🎉
          </span>

          <h2 className="text-4xl font-semibold text-white mt-2">
          Congratulations!
        </h2>

        
        <p className="mt-2 font-semibold text-xl text-white text-center px-4">
          You have fully paid your loan and are now eligible to apply again.
          Thank you for your commitment!
        </p>

      
        <button
          className="mt-4 bg-white text-blue-500 font-semibold py-2 px-6 rounded-full shadow-md cursor-pointer transition-transform duration-300 transform hover:scale-110"
          onClick={handleClick}
        >
          Apply Again
        </button>

      </motion.div>
*/}

      {showCelebration ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mt-20 justify-center w-1/2 h-80 bg-gradient-to-r from-blue-500 to-cyan-400 border border-blue-300 rounded-lg shadow-md p-4"
        >
          <Confetti numberOfPieces={450} recycle={false} />

          <span className="text-4xl bg-white items-center pl-1.5 rounded-full py-2 pr-0.5">🎉</span>

          <h2 className="text-4xl font-semibold text-white mt-2">
            Congratulations!
          </h2>

          <p className="mt-2 font-semibold text-xl text-white text-center px-4">
            You have fully paid your loan and are now eligible to apply again.
            Thank you for your commitment!
          </p>

          <button
            className="mt-4 bg-white text-blue-500 font-semibold py-2 px-6 rounded-full shadow-md cursor-pointer transition-transform duration-300 transform hover:scale-110"
            onClick={handleClick}
          >
            Apply Again
          </button>
        </motion.div>
      ) : applicationSubmission?.status.trim() === "Pending" ? (
          <div className="flex w-auto flex-col p-8 items-center justify-center h-80  bg-yellow-100 border border-yellow-300 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className="text-gray-800 text-4xl animate-[spin_4s_linear_infinite] mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Your Loan Disbursement is currently under review.</h2>
            <p className="text-lg whitespace-nowrap mt-2 opacity-90"> We will notify you through gmail and you will receive your funds shortly upon approval.</p>
            <p className="text-sm mt-4 italic opacity-75"> Thank you for your Patience</p>
          </div>

        ) : applicationSubmission?.status.trim() === "Approved" ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='flex items-start  w-[1000px] justify-center' >
            {step === 1 && <PaymentStep1 nextStep={nextStep} />}
            {step === 2 && <PaymentStep2 prevStep={prevStep} nextStep={nextStep} />}
            {step === 3 && <PaymentStep3 prevStep={prevStep} nextStep={nextStep} />}
            {step === 4 && <PaymentStep4 prevStep={prevStep} setStep={setStep} />}



          </motion.div>

        ) : (
          <>

            {applicationData.status !== 'Approved' && applicationData.is_active !== "true" && (
            <div 
            className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg w-full max-w-md mx-auto overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 z-0"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-50 rounded-full -ml-6 -mb-6 z-0"></div>
            
            {/* Content container */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-center mb-6">
                <div className={`p-4 bg-blue-100 rounded-full text-blue-600 transform transition-all duration-500 ${isHovering ? 'scale-110' : ''}`}>
                  <PlusCircle size={36} />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">Ready for Your First Loan?</h1>
              <p className="text-gray-600 text-center mb-6">Take the first step toward your financial goals today.</p>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex flex-col items-center p-2 text-center">
                  <DollarSign size={20} className="text-green-500 mb-1" />
                  <span className="text-xs text-gray-600">Competitive Rates</span>
                </div>
                <div className="flex flex-col items-center p-2 text-center">
                  <Clock size={20} className="text-blue-500 mb-1" />
                  <span className="text-xs text-gray-600">Quick Approval</span>
                </div>
                <div className="flex flex-col items-center p-2 text-center">
                  <Shield size={20} className="text-purple-500 mb-1" />
                  <span className="text-xs text-gray-600">Secure Process</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={goApply} 
                className={`w-full cursor-pointer flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 ${isHovering ? 'shadow-lg shadow-blue-200 translate-y-0' : 'shadow-md shadow-blue-100 translate-y-1'}`}
              >
                Apply for Loan Now
                <ChevronRight size={18} className="ml-2" />
              </button>
              
              {/* Trust elements */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure application • No hidden fees • 24/7 support
              </p>
            </div>
          </div>
            )}

            {applicationData.status === 'Approved' && (
              <>

                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className='flex items-center justify-center' >
                  {step === 1 && <Step1 nextStep={nextStep} />}

                  {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
                  {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} />}
                  {step === 4 && <Step4 nextStep={nextStep} prevStep={prevStep} />}
                  {step === 5 && <Step5 nextStep={nextStep} prevStep={prevStep} />}
                  {step === 6 && <Step6 prevStep={prevStep} />}
                </motion.div>

              </>

            )}

          </>

        )}


    </section>
  );
};

export default Loan;

