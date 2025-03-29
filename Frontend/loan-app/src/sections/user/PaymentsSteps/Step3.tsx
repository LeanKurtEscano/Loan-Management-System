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
    const { data, isLoading, isError } = useQuery(["userLoanSubmission3"], getLoanSubmission);
 
    if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="flex justify-center items-center h-screen text-red-500">Error fetching data</div>;
    
    const paymentMethod = data?.cashout || "Gcash"; // Default to GCash
    const formattedMethod = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).toLowerCase();
    const qrImage = paymentMethod === "gcash" 
        ?  qr
        : paymentMethod === "paymaya" 
        ? qr
        : "";

    return (
        <div className="flex flex-col items-center  min-h-screen p-6 ">
            <motion.div 
                className="bg-white shadow-xl p-8 rounded-xl border border-gray-200 w-full max-w-md text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
           
                <h2 className="text-xl font-semibold text-gray-800">{formattedMethod}</h2>
                
             
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
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
                        <img src={qrImage} alt={`${formattedMethod} QR Code`} className="w-40 h-40 mx-auto" />
                    ) : (
                        <div className="text-gray-500">QR Code for {formattedMethod} is not available</div>
                    )}
                </motion.div>

                <div className="flex justify-between mt-6 gap-4">
                    <button 
                        className="w-full bg-gray-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
                        onClick={prevStep}
                    >
                        Back
                    </button>
                    <button 
                        className="w-full bg-blue-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
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
