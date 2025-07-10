import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCarLoanDisbursement } from '../../services/rental/carDisbursement';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import Confetti from "react-confetti";
const CarLoan = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/apply-car-loan");
  };
  
  const { data, isLoading, error } = useQuery(["carLoanDisbursement"],  fetchCarLoanDisbursement);

  console.log(data);
  const showCelebration =
    data?.is_celebrate === true &&
    data?.status?.trim() !== "Ongoing"

  return (
    <>

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
      ) :  data.status.trim() === "Ongoing" ? (
          <div className="flex w-auto flex-col p-8 items-center justify-center h-80  bg-yellow-100 border border-yellow-300 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className="text-gray-800 text-4xl animate-[spin_4s_linear_infinite] mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Your Loan Disbursement is currently under review.</h2>
            <p className="text-lg whitespace-nowrap mt-2 opacity-90"> We will notify you through gmail and you will receive your funds shortly upon approval.</p>
            <p className="text-sm mt-4 italic opacity-75"> Thank you for your Patience</p>
          </div>

    ) : (
      null

    )}
    
    
    </>
  )
}

export default CarLoan