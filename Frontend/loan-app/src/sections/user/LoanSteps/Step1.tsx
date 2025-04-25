import { motion } from "framer-motion";

const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400" />
      
      <div className="px-6 py-8 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2 
          }}
          className="bg-white rounded-full p-4 shadow-lg"
        >
          <span className="text-5xl">🎉</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mt-6 text-center"
        >
          Congratulations!
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4"
        >
          <p className="text-lg text-white text-center leading-relaxed">
            Based on our assessment, you meet the eligibility criteria for a loan.
            You may now proceed with your loan application, and the final approved
            amount will be determined after a detailed review.
          </p>
        </motion.div>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="mt-8 bg-white cursor-pointer text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg flex items-center group"
        >
          View Offer
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Step1;