import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faDownload, faArrowLeft, faCar, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTime, formatDateWithWords } from "../../utils/formatDate";
import gcash from "../../assets/gcashtext.png";
import maya from "../../assets/mayatext.webp";
import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../../services/user/disbursement';
import { getTransactions } from '../../services/user/disbursement';
import { motion } from "framer-motion";
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { printTransaction } from '../../utils/pdf';
import { downloadTransactionPDF } from '../../utils/pdf';
import { getCarPaymentDetail } from '../../services/rental/carDisbursement';

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const numId = parseInt(id ?? "0", 10);

  // Determine transaction type from URL path
  const isCarTransaction = location.pathname.includes('car-transactions');
  const transactionType = isCarTransaction ? 'car' : 'loan';

  // Query for loan transaction
  const { data: loanData, isLoading: loanLoading, isError: loanError } = useQuery(
    ["userTransactions", numId], 
    () => getTransaction(numId), 
    { enabled: !isNaN(numId) && !isCarTransaction }
  );

  // Query for car transaction
  const { data: carData, isLoading: carLoading, isError: carError } = useQuery(
    ["userCarTransactions", numId], 
    () => getCarPaymentDetail(numId), 
    { enabled: !isNaN(numId) && isCarTransaction }
  );
  console.log(carData)

  // Determine which data to use
  const data = isCarTransaction ? carData : loanData;
  const isLoading = isCarTransaction ? carLoading : loanLoading;
  const isError = isCarTransaction ? carError : loanError;

  // Helper function to get transaction details based on type
  const getTransactionDetails = () => {
    if (!data) return null;

    const randomLetters = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    if (isCarTransaction) {
      // Car transaction structure
      return {
        id: data?.id || 0,
        reference_id: `CAR-${data?.id}-${randomLetters}`,
        amount: data?.amount || 0,
        created_at: data?.created_at || '',
        status: data?.status || 'N/A',
        period: data?.period || 'N/A',
        user: {
          username: data?.disbursement.application.user.username || 'N/A',
          contact_number: data?.disbursment?.application.phone_number || 'N/A'
        },
        // Car-specific fields
        disbursement: {
          rental_frequency: "Monthly" || 'N/A',
          payment_method: data?.disbursement?.payment_method || 'gcash',
          car_details: data?.disbursement?.car_details || {},
        
          security_deposit: data?.disbursement?.security_deposit || 0,
        },
        penalty_fee: data?.penalty_fee || 0,
        is_penalty: data?.is_penalty || false,
        type: 'car'
      };
    } else {
      // Loan transaction structure (existing)
      const paidAmount = parseFloat(data?.amount ?? "0");
      const interestRate = parseFloat(data?.loan.loan_app.interest ?? "0") / 100;
      const loanAmount = parseFloat(data?.loan.loan_amount ?? "0");
      const totalInterest = loanAmount * interestRate;
      const interestPortion = (totalInterest / loanAmount) * paidAmount;
      const principalAmount = paidAmount - interestPortion;

      return {
        id: data?.id || 0,
        reference_id: `LOAN-${data?.id}-${randomLetters}`,
        amount: data?.amount || 0,
        created_at: data?.created_at || '',
        status: data?.status || 'N/A',
        loan: {
          cashout: data?.loan.cashout || 'N/A',
          frequency: data?.loan.frequency || 'N/A',
          loan_amount: data?.loan.loan_amount || 0,
          loan_app: {
            interest: data?.loan.loan_app.interest || 0
          }
        },
        period: data?.period || 'N/A',
        user: {
          username: data?.user.username || 'N/A',
          contact_number: data?.user.contact_number || 'N/A'
        },
        calculations: {
          principalAmount,
          interestPortion,
          totalInterest
        },
        type: 'loan'
      };
    }
  };

  const transactionData = getTransactionDetails();

  const goBack = () => {
    navigate(-1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto p-6 text-center"><LoadingAnimation/></div>;
  }

  if (isError || !transactionData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load transaction details.</span>
        </div>
      </div>
    );
  }

  // Get payment method for both types
  const getPaymentMethod = () => {
    if (isCarTransaction) {
      return transactionData.disbursement?.payment_method || 'gcash';
    }
    return transactionData.loan?.cashout || 'gcash';
  };

  const paymentMethod = getPaymentMethod();

  return (
    <motion.div 
      className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with back button */}
      <motion.div className="mb-6 flex items-center" variants={itemVariants}>
        <button 
          onClick={goBack}
          className="text-blue-600 hover:text-blue-800 mr-4 flex cursor-pointer items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Transactions
        </button>
      </motion.div>

      <motion.div className="border-b pb-4 mb-6" variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={isCarTransaction ? faCar : faMoneyBill} 
              className="mr-2 text-blue-600" 
            />
            <h1 className="text-2xl font-bold">
              {isCarTransaction ? 'Car Rental Receipt' : 'Loan Receipt'}
            </h1>
          </div>
          <div>
            <button 
              onClick={() => printTransaction(transactionData)} 
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg mr-2 text-sm"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
            <button 
              onClick={() => downloadTransactionPDF(transactionData)} 
              className="bg-gray-200 cursor-pointer hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
            </button>
          </div>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <p>Reference: {transactionData.reference_id}</p>
          <p>Date: {formatDateWithWords(transactionData.created_at)} {formatTime(transactionData.created_at)}</p>
        </div>
      </motion.div>

      {/* Status Banner */}
      <motion.div 
        className={`mb-6 p-3 rounded-lg text-center text-white font-bold ${
          transactionData.status === "Approved" ? "bg-green-600" : 
          transactionData.status === "Rejected" ? "bg-red-600" : "bg-yellow-600"
        }`}
        variants={itemVariants}
      >
        {isCarTransaction ? 'Car Rental' : 'Loan'} Transaction {transactionData.status}
      </motion.div>

      {/* Payment Method */}
      <motion.div className="mb-6 flex items-center justify-center" variants={itemVariants}>
        <p className="text-gray-600 mr-3">Payment Method:</p>
        <div className="flex items-center">
          {paymentMethod === "gcash" && 
            <img src={gcash} alt="Gcash" className="h-8" />}
          {paymentMethod === "maya" && 
            <img src={maya} alt="Maya" className="h-8" />}
        </div>
      </motion.div>

      {/* Transaction Details - Dynamic based on type */}
      <motion.div className="border-b pb-4 mb-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Account Name</p>
            <p className="font-medium">{transactionData.user.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount Paid</p>
            <p className="font-medium">{formatCurrency(transactionData.amount)}</p>
          </div>
          
          {/* Car-specific fields */}
          {isCarTransaction && (
            <>
              <div>
                <p className="text-gray-600">Rental Frequency</p>
                <p className="font-medium">{transactionData.disbursement.rental_frequency}</p>
              </div>
              <div>
                <p className="text-gray-600">Settlement Period</p>
                <p className="font-medium">{transactionData.period}</p>
              </div>
              {transactionData.is_penalty && (
                <div>
                  <p className="text-gray-600">Penalty Fee</p>
                  <p className="font-medium text-red-600">{formatCurrency(transactionData.penalty_fee)}</p>
                </div>
              )}
             
            </>
          )}

          {/* Loan-specific fields */}
          {!isCarTransaction && (
            <>
              <div>
                <p className="text-gray-600">Interest Rate</p>
                <p className="font-medium">{transactionData.loan.loan_app.interest}%</p>
              </div>
              <div>
                <p className="text-gray-600">Settlement Duration</p>
                <p className="font-medium">{transactionData.period}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Frequency</p>
                <p className="font-medium">{transactionData.loan.frequency}</p>
              </div>
              <div>
                <p className="text-gray-600">Loan Amount</p>
                <p className="font-medium">{formatCurrency(transactionData.loan.loan_amount)}</p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Payment Schedule */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">{formatDateWithWords(transactionData.created_at)}</td>
                <td className="p-3">{formatCurrency(transactionData.amount)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transactionData.status === "Approved" ? "bg-green-100 text-green-800" : 
                    transactionData.status === "Scheduled" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {transactionData.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Totals - Dynamic based on type */}
      <motion.div className="bg-gray-50 p-4 rounded-lg mb-6" variants={itemVariants}>
        {isCarTransaction ? (
          // Car rental totals
          <>
          
            {transactionData.is_penalty && (
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Penalty Fee:</p>
                <p className="font-medium text-red-600">{formatCurrency(transactionData.penalty_fee)}</p>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <p>Total Amount Paid:</p>
              <p>{formatCurrency(transactionData.amount)}</p>
            </div>
          </>
        ) : (
          // Loan totals
          <>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Principal Amount:</p>
              <p className="font-medium">{formatCurrency(transactionData.calculations.principalAmount)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Interest Amount:</p>
              <p className="font-medium">{formatCurrency(transactionData.calculations.interestPortion)}</p>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <p>Total Amount Paid:</p>
              <p>{formatCurrency(transactionData.amount)}</p>
            </div>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div className="text-center text-gray-500 text-sm" variants={itemVariants}>
        <p>Transaction ID: {transactionData.id}</p>
        <p>Processed on: {formatDateWithWords(transactionData.created_at)}</p>
        <p className="mt-4">
          If you have any questions about this {isCarTransaction ? 'car rental' : 'loan'} transaction, 
          please contact our support.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetail;