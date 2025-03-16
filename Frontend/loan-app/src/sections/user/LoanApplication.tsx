import React from 'react'
import ProgressBar from '../../components/ProgressBar'
import { useState } from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import Step6 from './Steps/Step6';
import Step7 from './Steps/Step7';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const LoanApplication: React.FC = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto p-6 mb-7 bg-white  rounded-lg">
      <div className='mb-16'>
      <button
        onClick={() => nav('/')}
        className="absolute top-20 left-4 md:left-40 cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
        Go Back
      </button>

      </div>

      <ProgressBar step={step} totalSteps={totalSteps} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && <Step1 nextStep={nextStep} />}
        {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Step4 nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Step5 nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <Step6 nextStep={nextStep} prevStep={prevStep} />}
        {step === 7 && <Step7 prevStep={prevStep} />}
      </motion.div>
    </div>
  );

}

export default LoanApplication