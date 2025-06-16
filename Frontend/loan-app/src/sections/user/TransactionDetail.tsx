import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faDownload, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTime, formatDateWithWords } from "../../utils/formatDate";
import gcash from "../../assets/gcashtext.png";
import maya from "../../assets/mayatext.webp";
import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../../services/user/disbursement';
import { motion } from "framer-motion";
import { LoadingAnimation } from '../../components/LoadingAnimation';
import { printTransaction } from '../../utils/pdf';
import { downloadTransactionPDF } from '../../utils/pdf';
const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numId = parseInt(id ?? "0", 10);

  const { data, isLoading, isError, error } = useQuery(
    ["userTransactions", numId], 
    () => getTransaction(numId), 
    { enabled: !isNaN(numId) } 
  );

  const paidAmount = parseFloat(data?.amount ?? "0");
  const interestRate = parseFloat(data?.loan.loan_app.interest ?? "0") / 100;
  const loanAmount = parseFloat(data?.loan.loan_amount ?? "0");
  const randomLetters = Math.random().toString(36).substring(2, 7).toUpperCase();
  // Calculating total interest for the entire loan duration
  const totalInterest = loanAmount * interestRate;

  // Finding principal portion of the current payment
  const interestPortion = (totalInterest / loanAmount) * paidAmount;
  const principalAmount = paidAmount - interestPortion;
    
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

  const transactionData = {
    id: data?.id || 0,  
    reference_id: `${data?.id}-${randomLetters} `|| 'N/A',
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
    formattedData: {
      date: formatDateWithWords(data?.created_at) + " " + formatTime(data?.created_at),
      paidAmount: formatCurrency(data?.amount),
      interestRate: `${data?.loan.loan_app.interest || 0}%`,
      principalAmount: formatCurrency(principalAmount),
      totalInterest: formatCurrency(interestPortion),
      totalAmount: formatCurrency(data?.amount),
      processedOn: formatDateWithWords(data?.created_at) || 'N/A'
    },
    paymentSchedule: [
      {
        date: formatDateWithWords(data?.created_at),
        amount: formatCurrency(data?.amount),
        status: data?.status
      }
    ]
  };
  



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
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 " />
          Back to Transactions
        </button>
      </motion.div>

      <motion.div className="border-b pb-4 mb-6" variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transaction Receipt</h1>
          <div>
            <button  onClick={() => printTransaction(transactionData)} className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg mr-2 text-sm">
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
            <button onClick={() => downloadTransactionPDF(transactionData)} className="bg-gray-200  cursor-pointer hover:bg-gray-300 px-4 py-2 rounded-lg text-sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
            </button>
          </div>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <p>Reference: {`${data?.id}-${randomLetters}`  || 'N/A'}</p>
          <p>Date: {formatDateWithWords(data?.created_at)} {formatTime(data?.created_at)}</p>
        </div>
      </motion.div>

      {/* Status Banner */}
      <motion.div 
        className={`mb-6 p-3 rounded-lg text-center text-white font-bold ${
          data?.status === "Approved" ? "bg-blue-600" : 
          data?.status === "Rejected" ? "bg-red-600" : "bg-yellow-600"
        }`}
        variants={itemVariants}
      >
        Transaction {data?.status}
      </motion.div>

      {/* Payment Method */}
      <motion.div className="mb-6 flex items-center justify-center" variants={itemVariants}>
        <p className="text-gray-600 mr-3">Payment Method:</p>
        <div className="flex items-center">
          {data?.loan.cashout === "gcash" && 
            <img src={gcash} alt="Gcash" className="h-8" />}
          {data?.loan.cashout === "maya" && 
            <img src={maya} alt="Maya" className="h-8" />}
        </div>
      </motion.div>

      {/* Transaction Details */}
      <motion.div className="border-b pb-4 mb-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Account Name</p>
            <p className="font-medium">{data?.user.username}</p>
          </div>
         
          <div>
            <p className="text-gray-600">Paid Amount</p>
            <p className="font-medium">{formatCurrency(data?.amount)}</p>
          </div>
          <div>
            <p className="text-gray-600">Interest Rate</p>
            <p className="font-medium">{data?.loan.loan_app.interest}%</p>
          </div>
          <div>
            <p className="text-gray-600">Settlement Duration</p>
            <p className="font-medium">{data?.period}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment Frequency</p>
            <p className="font-medium">{data?.loan.frequency}</p>
          </div>
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
                <td className="p-3">{formatDateWithWords(data?.created_at)}</td>
                <td className="p-3">{formatCurrency(data?.amount)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    data?.status === "Approved" ? "bg-green-100 text-green-800" : 
                    data?.status === "Scheduled" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {data?.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Totals */}
      <motion.div className="bg-gray-50 p-4 rounded-lg mb-6" variants={itemVariants}>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Principal Amount:</p>
          <p className="font-medium">{formatCurrency(principalAmount)}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Total Interest:</p>
          <p className="font-medium">{formatCurrency(interestPortion)}</p>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <p>Total Amount to be Paid:</p>
          <p>{formatCurrency(data?.amount)}</p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div className="text-center text-gray-500 text-sm" variants={itemVariants}>
        <p>Transaction ID: {data?.id || 'N/A'}</p>
        <p>Processed on: {formatDateWithWords(data?.created_at) || 'N/A'}</p>
        <p className="mt-4">If you have any questions about this transaction, please contact our support.</p>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetail;