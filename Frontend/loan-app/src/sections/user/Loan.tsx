import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLoanApplication } from '../../services/user/userData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { getLoanSubmission } from '../../services/user/userData';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import Step1 from './LoanSteps/Step1';
import Step2 from './LoanSteps/Step2';
import Step4 from './LoanSteps/Step4';
import Step3 from './LoanSteps/Step3';
import Step5 from './LoanSteps/Step5';
import Step6 from './LoanSteps/Step6';
const Loan: React.FC = () => {

  const { data: loanSubmissions, isLoading: isSubLoading, isError: isSubError } = useQuery(
    ['userLoanSubmission'],
    getLoanSubmission
  );


  console.log(loanSubmissions)
  const { data, isLoading, isError } = useQuery(
    ['userLoanApplication'],
    getLoanApplication
  );


  const totalSteps = 6;

  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  console.log(data)

  const nav = useNavigate();

  const goApply = () => {
    nav('/user/apply-loan')
  }



  const applicationSubmission = loanSubmissions ?? { status: 'new' };
  const applicationData = data ?? { status: 'new' };

  return (
    <section className="flex flex-col items-center w-full  mb-36 bg-white text-gray-800 p-4">


      {applicationSubmission?.status.trim() === "Pending" ? (
        <div className="flex flex-col w-1/2 items-center justify-center h-80  bg-yellow-100 border border-yellow-300 rounded-lg shadow-md text-center">
          <FontAwesomeIcon
            icon={faHourglassHalf}
            className="text-gray-800 text-4xl animate-[spin_4s_linear_infinite] mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">We are Verifying your Loan</h2>
          <p className="text-lg mt-2 opacity-90">You will receive your funds shortly!</p>
          <p className="text-sm mt-4 italic opacity-75">This may take up to 24 hours. Thank you for your Patience</p>
        </div>
      ) : applicationSubmission?.status.trim() === "Approved" ? (
        <p>Approved</p>

      ) : (
        <>

          {applicationData.status !== 'Approved' && (
            <div className="text-center bg-gray-100 p-8 rounded-2xl border-gray-200 shadow-md max-w-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:translate-y-2">
              <FontAwesomeIcon icon={faPlusCircle} className="text-blue-500 text-5xl mb-4 animate-pulse" />
              <h1 className="text-3xl font-bold mb-2">You don't have a Loan </h1>
              <p className="text-gray-600 mb-4">Start your financial journey with us today!</p>
              <button onClick={goApply} className="px-6 py-3 bg-blue-500 cursor-pointer text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition hover:scale-110">
                Apply for Loan Now
              </button>
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

