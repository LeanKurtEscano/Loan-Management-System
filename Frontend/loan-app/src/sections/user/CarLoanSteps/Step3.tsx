import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { motion } from "framer-motion";
import qr from "../../../assets/qr.jpg"

interface Step3Props {
    nextStep: () => void;
    prevStep: () => void;
}

const Step3: React.FC<Step3Props> = ({ nextStep, prevStep }) => {

 

    
    const paymentMethod =   "gcash"; // Default to GCash
    const formattedMethod = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).toLowerCase();
    const qrImage = paymentMethod === "gcash" 
        ?  qr
        : paymentMethod === "maya" 
        ? qr
        : "";

    return (
        <div className="flex flex-col items-center  min-h-screen pt-12 ">
            <motion.div 
                className="bg-white shadow-xl p-8 rounded-xl border w-[800px] border-gray-200   text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
           
                <h2 className="text-3xl font-semibold text-gray-800">{formattedMethod}</h2>
                
             
                <p className="text-lg text-gray-600 mt-3 leading-relaxed">
                    To complete your payment, kindly open your <span className="font-medium">{formattedMethod} </span> 
                    account and scan the QR code below. After completing the transaction, take a screenshot of the receipt 
                    as proof of payment.
                </p>

             
                <motion.div 
                    className="mt-6 p-5  rounded-lg border border-gray-300"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {qrImage ? (
                        <img src={qrImage} alt={`${formattedMethod} QR Code`} className="w-80 h-80 mx-auto" />
                    ) : (
                        <div className="text-gray-500">QR Code for {formattedMethod} is not available</div>
                    )}
                </motion.div>
                <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className={`px-6 py-3 rounded-lg text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 cursor-pointer
              }`}
            onClick={nextStep}

          >
            Proceed
          </button>
        </div>
            </motion.div>
        </div>
    );
};

export default Step3;
