import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faChevronDown, faClock, faHandshake } from "@fortawesome/free-solid-svg-icons";
import home2 from "../../assets/home2.jpg";
import home3 from "../../assets/home3.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};
const faqs = [
  {
    question: 'How do I apply for a loan?',
    answer: 'You can apply by clicking the "Apply Now" button, filling in your details, and submitting the required documents.',
  },
  {
    question: 'What are the interest rates?',
    answer: 'Our interest rates vary based on your loan amount and repayment period. Contact our support for detailed information.',
  },
  {
    question: 'How long does approval take?',
    answer: 'Approval usually takes a few minutes, but it can vary depending on the verification process.',
  },
];

const Home = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <motion.div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <motion.div
        variants={fadeInUp}
        whileInView="visible"
        initial="hidden"
        viewport={{ once: false, amount: 0.2 }}
        className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between"
      >
        {/* Left Section */}
        <motion.div variants={fadeInUp} className="md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Huwag nang patagalin pa</h1>
          <h2 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4">ToLoan mo na 'yan!</h2>
          <p className="text-gray-600 mb-6">Best Interest Rates | Effortless Applications | Expert Service</p>

          {/* Button Animation */}
          <motion.div className="flex justify-center md:w-1/2 md:pl-32">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-blue-700 transition w-full md:w-auto shadow-md"
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div variants={fadeInUp} className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <motion.img
            src={home2}
            alt="Happy couple with loan approval"
            className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg"
            whileHover={{ scale: 1.03 }}
          />
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
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
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              custom={index * 0.3}
              whileHover={{ scale: 1.05 }}
              className="bg-white text-black items-center p-4 rounded-lg shadow-md flex flex-col border border-gray-300 gap-2"
            >
              <div className="flex flex-row items-center gap-2">
                <div className="bg-blue-600 p-3 rounded-full flex items-center justify-center w-12 h-12">
                  <FontAwesomeIcon icon={card.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-md font-semibold text-blue-600">{card.title}</h3>
              </div>
              <p className="text-gray-700 text-md">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New Section (Image Left, Text Right) */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="container mx-auto px-6 mt-16 flex flex-col md:flex-row items-center gap-8"
      >
        {/* Left Image */}
        <motion.div className="md:w-1/2 flex justify-center">
          <motion.img
            src={home3}
            alt="Financial Growth"
            className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg"
            whileHover={{ scale: 1.03 }}
          />
        </motion.div>

        {/* Right Text */}
        <motion.div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-600">
            Secure and Hassle-Free Loans
          </h2>
          <p className="text-gray-700 text-lg">
            With our simple and transparent process, you can get the financial support you need without any unnecessary stress.
            Whether it's for personal needs, business expansion, or emergency expenses, we ensure quick approvals and fair terms that work for you.
          </p>
        </motion.div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="container mx-auto px-6 text-center mt-16 bg-blue-600 text-white p-8 rounded-lg"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6">Apply now and get approved in minutes!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
        >
          Apply Now
        </motion.button>
      </motion.div>

      <motion.div className="container mx-auto px-6 mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <motion.div key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              custom={index * 0.3}
              whileHover={{ scale: 1.05 }}

              className="bg-white text-black p-4 rounded-lg shadow-md border border-gray-300 text-left"
            >
              <h3 className="text-md font-semibold">{faq.question}</h3>
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </motion.div>
  );
};

export default Home;
