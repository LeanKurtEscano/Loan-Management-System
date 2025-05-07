import React from 'react';
import { ChevronRight } from 'lucide-react';
import step1 from "../../assets/step1.png";
import step2 from "../../assets/step2.png";
import step3 from "../../assets/step3.png";
import step4 from "../../assets/step4.png";
import step5 from "../../assets/step5.png";
import step6 from "../../assets/step6.png";
import step7 from "../../assets/step7.png";
import step8 from "../../assets/step8.png";
import step9 from "../../assets/step9.png";
import step10 from "../../assets/step10.png";
import step11 from "../../assets/step11.png";
import step12 from "../../assets/step12.png";
import step13 from "../../assets/step13.png";
import step14 from "../../assets/step14.png";
import step15 from "../../assets/step15.png";
import step16 from "../../assets/step16.png";
import step17 from "../../assets/step17.png";
import step18 from "../../assets/step18.png";
import { motion } from 'framer-motion';
const Help = () => {
  // Step data array with all information
  const stepsData = [
    {
      title: 'Create Your Account',
      description: 'Fill in your username, email address, and password to create your TO-LOAN account.',
      image: step1,
      alert: null
    },
    {
      title: 'Complete Profile Verification',
      description: 'After creating your account, you\'ll need to verify your profile by providing your personal information.',
      image: step2,
      alert: null
    },
    {
      title: 'Submit Verification Details',
      description: 'Complete all required fields including your full name, age, birthdate, gender, civil status, address, and postal code.',
      image: step3,
      alert: {
        type: 'warning',
        title: 'Important Note:',
        message: 'Wait for the verification request to be approved. This process may take some time.'
      }
    },
    {
      title: 'Account Verification Confirmed',
      description: 'Once your account is verified, you\'ll see a notification in the app and also a message in your email. The account page will also display your verified user details.',
      image: step4,
      alert: {
        type: 'success',
        title: 'Success:',
        message: 'You can now apply for a loan! Your account is fully verified.'
      }
    },
    {
      title: 'Complete the Loan Application Process',
      description: 'To proceed with your loan application, please upload your identification documents. Select the ID type and upload both the front and back images clearly.',
      image: step5,
      alert: null
    },
    {
      title: 'Review Your Submission',
      description: 'Verify your employment status, monthly income, and other financial details to ensure accurate loan eligibility assessment.',
      image: step6,
      alert: null
    },
    {
      title: 'Loan Approval Process',
      description: 'Based on the provided information, the admin will review and assess your loan eligibility. If approved, you will receive a confirmation screen',
      image: step7,
      alert: null
    },
    {
      title: 'Select Loan Amount',
      description: 'Choose how much you want to borrow, up to your maximum eligible amount. The interest rate will be displayed here.',
      image: step8,
      alert: null
    },
    {
      title: 'Choose Repayment Terms',
      description: 'Select your preferred repayment date and frequency. A payment summary will show you the total amount due, including service fees.',
      image: step9,
      alert: null
    },
    {
      title: 'Select Cashout Method',
      description: 'Enter your contact number and choose your preferred method to receive the loan amount. Different options may have different processing times and service fees.',
      image: step10,
      alert: null
    },
    {
      title: 'Review and Submit',
      description: 'Before finalizing your loan application, review all your submission details. Confirm that everything is correct, check the terms and policies box, and submit your application.',
      image: step11,
      alert: null
    },
    {
      title: 'Loan Page',
      description: 'If your loan disbursement is approved, you can now see this page page. This shows your active loan details including the details and allows you to manage your payments.',
      image: step12,
      alert: {
        type: 'success',
        title: 'Congratulations!',
        message: 'Your loan has been approved and is now active.'
      }
    },
    {
      title: 'Choose Payment Amount',
      description: 'Select the amount you want to pay. You can pay the exact monthly amount due or make an advance payment to cover multiple months.',
      image: step13,
      alert: null
    },
    {
      title: 'Scan QR Code for Payment',
      description: 'If using GCash or Maya for payment, scan the provided QR code. Make sure to send the exact amount based on what you selected in the previous step.',
      image: step14,
      alert: {
        type: 'warning',
        title: 'Important:',
        message: 'Only send the exact amount shown on screen to avoid payment reconciliation issues.'
      }
    },
    {
      title: 'Upload Payment Receipt',
      description: 'Upload your GCash or Maya receipt as proof of payment. The image must be clear and the reference number must be clearly visible. The amount should match your selected payment.',
      image: step15,
      alert: {
        type: 'warning',
        title: 'Requirements:',
        message: 'Ensure the receipt image is clear, showing the correct amount and reference number.'
      }
    },
    {
        title: 'Payment Progress Tracking',
        description: 'If your payment is approved, you can see the progress bar will move and show how many percent of your loan has been paid off.',
        image: step16,
        alert: {
          type: 'success',
          title: 'Payment Confirmed:',
          message: 'Your payment has been processed and your loan progress has been updated.'
        }
      },
      {
        title: 'Payment Due Date',
        description: 'There is a strict due date for each payment. If there is no payment received by the due date, your account will incur a penalty.',
        image: step17,
        alert: {
          type: 'warning',
          title: 'Warning:',
          message: 'Missing the payment deadline will result in penalty fees being added to your account.'
        }
      },
      {
        title: 'Penalty Payment',
        description: 'The penalty is 10% of the monthly payment. If you have incurred a penalty, make sure to add this extra amount to your payment receipt.',
        image: step18,
        alert: {
          type: 'warning',
          title: 'Penalty Fee:',
          message: 'Add an extra 10% to your payment amount if paying after the due date to cover the penalty.'
        }
      },
  ];

  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">How to Apply for a Loan</h1>
      
      <div className="space-y-12">
        {/* Map through the steps data */}
        {stepsData.map((step, index) => (
            <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
            variants={animationVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {index + 1}
              </span>
              {step.title}
            </h2>
            <p className="text-gray-600 mb-4">{step.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <img src={step.image} alt={`Step ${index + 1} - ${step.title}`} className="mx-auto rounded" />
            </div>
            {step.alert && (
              <div className="mt-4" className={
                step.alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400 p-4' : 
                step.alert.type === 'success' ? 'bg-green-50 border-l-4 border-green-400 p-4' : ''
              }>
                <p className={`font-medium ${
                  step.alert.type === 'warning' ? 'text-yellow-700' : 
                  step.alert.type === 'success' ? 'text-green-700' : ''
                }`}>
                  {step.alert.title}
                </p>
                <p className={
                  step.alert.type === 'warning' ? 'text-yellow-600' : 
                  step.alert.type === 'success' ? 'text-green-600' : ''
                }>
                  {step.alert.message}
                </p>
              </div>
            )}
         </motion.div>
        ))}

        {/* "What's Next?" section */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              <ChevronRight size={20} />
            </span>
            What's Next?
          </h2>
          <p className="text-blue-700 mb-2">After submitting your application:</p>
          <ul className="list-disc pl-6 text-blue-600 space-y-2">
            <li>Your loan application will be processed</li>
            <li>Once approved, funds will be sent to your selected cashout method</li>
            <li>You'll receive confirmation via your registered contact number</li>
            <li>Remember to repay on time to maintain good standing for future loans</li>
          </ul>
        </div>
      </div>

      {/* Support section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Further Assistance?</h2>
        <p className="text-gray-600">If you have questions or encounter any issues during the application process, please contact our support team:</p>
        <div className="mt-4">
          <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@to-loan.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;