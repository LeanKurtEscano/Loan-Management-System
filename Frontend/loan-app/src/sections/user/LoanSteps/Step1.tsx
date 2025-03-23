import React from 'react'
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useMyContext } from '../../../context/MyContext';
const Step1 = ({ nextStep }: { nextStep: () => void;  })=> {


 
  return (
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
    
        {/* Header Text */}
        <h2 className="text-4xl font-semibold text-white mt-2">
          Congratulations!
        </h2>
    
        {/* Updated Message */}
        <p className="mt-2 font-semibold text-xl text-white text-center px-4">
          Based on our assessment, you meet the eligibility criteria for a loan.  
          You may now proceed with your loan application, and the final approved  
          amount will be determined after a detailed review.
        </p>
    
        {/* View Offer Button */}
        <button
          className="mt-4 bg-white text-blue-500 font-semibold py-2 px-6 rounded-full shadow-md cursor-pointer  transition-transform duration-300"
          onClick={nextStep}
        >
          View Offer
        </button>
      </motion.div>
  )
}

export default Step1