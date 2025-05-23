import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThumbsUp, 
  faChevronDown, 
  faClock, 
  faHandshake, 
  faShieldAlt, 
  faPhoneAlt, 
  faStar, 
  faUsers, 
  faChartLine,
  faQuestionCircle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import home2 from "../../assets/home2.jpg";
import home3 from "../../assets/home3.jpg";
import { useNavigate } from "react-router-dom";

import { useMyContext } from "../../context/MyContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

const popupAnimation = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" }
  }
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
  {
    question: 'What documents are required?',
    answer: 'Generally, you need a valid ID, proof of income, and bank statements from the last 3 months. Additional documents may be required based on your application.',
  },
  {
    question: 'Is there a penalty for early repayment?',
    answer: 'No, we encourage early repayments and don\'t charge any penalties for settling your loan before the due date.',
  },
];

const testimonials = [
  {
    name: "Lean Escano",
    role: "Small Business Owner",
    comment: "The quick approval process helped me secure inventory for my shop during our busiest season. Highly recommended!",
    rating: 5
  },
  {
    name: "John Doe",
    role: "IT Professional",
    comment: "I needed funds for a family emergency, and the process was seamless. Got approved within minutes!",
    rating: 5
  },
  {
    name: "Sarah Ramos",
    role: "Freelancer",
    comment: "As someone with irregular income, I was surprised how easy it was to get a loan. The terms were fair and transparent.",
    rating: 4
  }
];

const Home = () => {
  const nav = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isAuthenticated, isVerified } = useMyContext();
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  

  console.log(isVerified)
  // Show help popup after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelpPopup(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const goToLogin = () => {
    nav('/login');
  }

  const goToAccount = () => {
    nav('/user/account');
  }

    const goToSupport = () => {
    nav('/support');
  }





  const goToLoan = () => {
    nav('/user/apply-loan');
  }

  const goToHelp = () => {
    nav('/help');
  }

  return (
    <motion.div className="min-h-screen bg-white text-gray-900">
      {/* Main content wrapper with side whitespace */}
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 lg:px-16">
        {/* Hero Section - Redesigned to ModernSaaS style */}
        <div className=" rounded-xl mt-6">
          <div className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
            <motion.div
              variants={fadeInUp}
              whileInView="visible"
              initial="hidden"
              viewport={{ once: false, amount: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              {/* Main Heading */}
              <motion.h1 
                variants={fadeInUp} 
                custom={0.2}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl"
              >
                Huwag nang patagalin pa<br /><span className="text-blue-600">To-Loan mo na yan!</span>
              </motion.h1>
              
              {/* Subheading */}
              <motion.p 
                variants={fadeInUp} 
                custom={0.3}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
              >
                Experience the best interest rates with effortless applications and expert service. Get the financial support you need in minutes.
              </motion.p>
              
              {/* CTAs */}
              <motion.div 
                variants={fadeInUp} 
                custom={0.4}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isAuthenticated && isVerified ? goToLoan : isAuthenticated ? goToAccount : goToLogin}
                  className="bg-blue-600 cursor-pointer text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Get Started
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToHelp}
                  className="border border-blue-600 cursor-pointer text-blue-600 font-medium px-8 py-3 rounded-lg hover:bg-blue-50 transition"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className=" py-10 mt-10 rounded-xl">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              {[
                { number: "10,000+", label: "Satisfied Clients" },
                { number: "₱100M+", label: "Loans Disbursed" },
                { number: "5 min", label: "Average Approval Time" },
                { number: "24/7", label: "Customer Support" },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  custom={index * 0.1}
                  className="p-4"
                >
                  <p className="text-3xl font-bold text-blue-600">{stat.number}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="py-12 mt-10 bg-white rounded-xl  ">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <motion.h2 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mb-8"
            >
              Why Choose Our Loan Services?
            </motion.h2>
            
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
                  className="bg-white text-black p-6 rounded-lg shadow-md flex flex-col items-center border border-gray-300 text-center"
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="bg-blue-600 p-3 rounded-full flex items-center justify-center w-12 h-12">
                      <FontAwesomeIcon icon={card.icon} className="text-white text-2xl" />
                    </div>
                    <h3 className="text-md font-semibold text-blue-600">{card.title}</h3>
                  </div>
                  <p className="text-gray-700 text-md mt-2">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      
        <div className="py-12 mt-10 bg-white  ">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mb-8 text-center"
            >
              How It Works
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  step: 1, 
                  title: "Apply Online", 
                  description: "Fill out our simple application form in just a few minutes."
                },
                { 
                  step: 2, 
                  title: "Quick Verification", 
                  description: "Our system verifies your information instantly."
                },
                { 
                  step: 3, 
                  title: "Get Approved", 
                  description: "Receive loan approval within minutes of applying."
                },
                { 
                  step: 4, 
                  title: "Receive Funds", 
                  description: "Money is transferred directly to your account."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  custom={index * 0.2}
                  className="text-center relative"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-full h-0.5 bg-blue-200"></div>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="py-12 mt-10 bg-gray-50 rounded-xl"
        >
          <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center gap-8">
            {/* Left Image */}
            <motion.div className="md:w-1/2 flex justify-center">
              <motion.img
                src={home3}
                alt="Financial Growth"
                className="rounded-lg shadow-lg w-full max-w-md"
                whileHover={{ scale: 1.03 }}
              />
            </motion.div>

            {/* Right Text */}
            <motion.div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600">
                Secure and Hassle-Free Loans
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                With our simple and transparent process, you can get the financial support you need without any unnecessary stress.
                Whether it's for personal needs, business expansion, or emergency expenses, we ensure quick approvals and fair terms that work for you.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: faShieldAlt, text: "Bank-level security for your information" },
                  { icon: faChartLine, text: "Competitive interest rates" },
                  { icon: faUsers, text: "Dedicated customer support team" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-blue-600">
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="py-12 mt-10 bg-white rounded-xl ">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mb-8 text-center"
            >
              What Our Clients Say
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  custom={index * 0.3}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section - Expanded */}
        <div className="py-12 mt-10 bg-gray-50 rounded-xl">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.h2 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-blue-600 mb-8 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  custom={index * 0.3}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white text-black p-5 rounded-lg shadow-md border border-gray-300 text-left"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="py-12 mt-10 mb-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="bg-blue-600 text-white p-8 md:p-10 rounded-xl text-center shadow-lg"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">Apply now and get approved in minutes with our secure and hassle-free process!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isAuthenticated && isVerified ? goToLoan : isAuthenticated ? goToAccount : goToLogin}
                  className="bg-white cursor-pointer text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
                >
                  Apply Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToSupport}
                  className="border border-white cursor-pointer text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                  Contact Support
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Help Popup */}
      <AnimatePresence>
        {showHelpPopup && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            variants={popupAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white rounded-lg shadow-xl border border-blue-100 w-64 sm:w-72 overflow-hidden">
              {/* Header with close button */}
              <div className="bg-blue-600 text-white  p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                  <span className="font-semibold">Need Help?</span>
                </div>
                <button 
                  onClick={() => setShowHelpPopup(false)}
                  className="text-white cursor-pointer hover:text-gray-200 transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              {/* Popup content */}
              <div className="p-4">
                <p className="text-gray-700 mb-4">
                  Confused on how to apply for a loan? Our help center provides detailed guidance.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToHelp}
                  className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Get Help Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;