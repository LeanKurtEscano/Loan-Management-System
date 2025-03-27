import React from "react";
import { motion } from "framer-motion";
import monsterGif from "../../../assets/peeking.gif"; 
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { formatDate, formatDateWithWords } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";


interface Step1Props {
    nextStep: () => void;
}

const Step1: React.FC<Step1Props> = ({ nextStep }) => {
    const { data, isLoading, isError } = useQuery(
        ['userLoanSubmission'],
        getLoanSubmission
      );
    
    return (
        <motion.div
            className="relative flex justify-center items-center min-h-screen p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
           
            <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-300 relative">
                

  <motion.img
                    src={monsterGif}
                    alt="Peeking Monster"
                    className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-60 h-40"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ yoyo: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
              
                <div className="flex justify-between items-center mb-9 mt-6">
                    <h2 className="text-gray-600 text-sm font-semibold">
                        END DATE: <span className="text-gray-900 font-bold">{formatDateWithWords(  data?.repay_date)}</span>
                    </h2>
                    <h3 className="text-gray-600 text-sm font-semibold">
                         FREQUENCY:  <span className="text-gray-900 font-bold">{data?.frequency.charAt(0).toUpperCase() + data?.frequency.slice(1).toLowerCase()}</span>
                    </h3>
                </div>

                <motion.div
                    className="text-center mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl font-extrabold text-gray-900">{formatCurrency( data?.balance)  }</h1>
                </motion.div>

              
                <motion.div
                    className="text-center text-lg font-semibold text-blue-500 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    50% Paid
                </motion.div>

           
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "50%" }}
                        transition={{ duration: 1 }}
                    />
                </div>

                
                <p className="text-gray-700 text-sm mt-5 text-center leading-relaxed">
                    Your next payment of <span className="font-semibold">PHP 340.00</span> is due on{" "}
                    <span className="font-semibold">April 30, 2025, at 12:00 PM</span>. Please ensure timely
                    payment to avoid any penalties. Thank you.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full cursor-pointer bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition font-semibold text-lg"
                        onClick={nextStep}
                    >
                        Make a Payment
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full border cursor-pointer border-gray-400 text-gray-700 py-3 rounded-lg shadow-md hover:bg-gray-100 transition font-semibold text-lg"
                    >
                        View Payment History
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default Step1;
