import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faClock, faHandshake } from "@fortawesome/free-solid-svg-icons";
import home2 from "../../assets/home2.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

const Home = () => {
  return (
    <motion.div initial="hidden" animate="visible" className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <motion.div
        variants={fadeInUp}
        className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Section */}
        <motion.div variants={fadeInUp} className="md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold  mb-2">
            Huwag nang patagalin pa
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4">
            ToLoan mo na 'yan!
          </h2>
          <p className="text-gray-600 mb-6">
            Best Interest Rates | Effortless Applications | Expert Service
          </p>

          {/* Button Animation */}
          <motion.div className="flex justify-center md:w-1/2 md:pl-32">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full md:w-auto shadow-md"
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>

     
        <motion.div variants={fadeInUp} className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <motion.img
            src={home2}
            alt="Happy couple with loan approval"
            className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg"
            whileHover={{ scale: 1.03 }}
          />
        </motion.div>
      </motion.div>

   
      <div className="container mx-auto px-6 text-center mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: faThumbsUp,
              title: "Easy",
              description:
                "It is easy to take out the loan. No formalities or documents needed. Flexible repayment options.",
            },
            {
              icon: faClock,
              title: "Quick",
              description:
                "Quick and easy application. Instant decision lending. Instant cash when you need it.",
            },
            {
              icon: faHandshake,
              title: "Fairly",
              description: "No hidden charges. 24/7 customer service.",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index * 0.3} 
              whileHover={{ scale: 1.05 }}
              className="bg-white text-black items-center p-4 rounded-lg shadow-md flex flex-col border border-gray-300 gap-2"
            >
              {/* Icon & Title (Side by Side) */}
              <div className="flex flex-row items-center gap-2">
                <div className="bg-blue-600 p-3 rounded-full flex items-center justify-center w-12 h-12">
                  <FontAwesomeIcon icon={card.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-md font-semibold text-blue-600">{card.title}</h3>
              </div>

              {/* Description Below */}
              <p className="text-gray-700 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
