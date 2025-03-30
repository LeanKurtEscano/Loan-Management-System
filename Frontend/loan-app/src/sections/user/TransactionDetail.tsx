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
const TransactionDetail = () => {
  // In a real app, you would fetch the specific transaction by ID
  // For demo purposes, I'm creating sample data similar to what you provided
  const navigate = useNavigate();
  const { id } = useParams();

// Convert id to an integer safely
const numId = parseInt(id ?? "0", 10);

// Fetch data using the converted ID
const { data, isLoading, isError, error } = useQuery(
  ["userTransactions", numId], 
  () => getTransaction(numId), // Pass numId to the function
  { enabled: !isNaN(numId) } // Ensure the query runs only if numId is a valid number
);


console.log(data);
  // Mock transaction data (in a real app, this would come from an API)
  const transaction = {
    id: "TXN-2025-0330-001",
    created_at: "2025-03-30T16:49:00",
    amount: 37100,
    status: "Approved",
    period: "3 years",
    reference_number: "GC-25330-49PM-XZ1",
    loan: {
      frequency: "yearly",
      cashout: "gcash",
      interest_rate: 8.5,
      payment_amount: 13256.67,
      payment_schedule: [
        { date: "2026-03-30", amount: 13256.67, status: "Scheduled" },
        { date: "2027-03-30", amount: 13256.67, status: "Scheduled" },
        { date: "2028-03-30", amount: 13256.67, status: "Scheduled" }
      ]
    },
    account_number: "09*********12",
    account_name: "Juan Dela Cruz",
    processing_fee: 750,
    timestamp: "2025-03-30T16:49:23"
  };

  // Calculate totals
  const totalPayments = transaction.loan.payment_schedule.reduce((sum, schedule) => sum + schedule.amount, 0);
  const totalInterest = totalPayments - transaction.amount;

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button 
          onClick={goBack}
          className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Transactions
        </button>
      </div>
\
      <div className="border-b pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Transaction Receipt</h1>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 text-sm">
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
            </button>
          </div>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <p>Reference: {transaction.reference_number}</p>
          <p>Date: {formatDateWithWords(data?.created_at)} {formatTime(data?.created_at)}</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 p-3 rounded-lg text-center text-white font-bold ${
        data?.status === "Approved" ? "bg-blue-600" : 
        data?.status === "Rejected" ? "bg-red-600" : "bg-yellow-600"
      }`}>
        Transaction {data?.status}
      </div>

      {/* Payment Method */}
      <div className="mb-6 flex items-center justify-center">
        <p className="text-gray-600 mr-3">Payment Method:</p>
        <div className="flex items-center">
          {data?.loan.cashout === "gcash" && 
            <img src={gcash} alt="Gcash" className="h-8" />}
          {data?.loan.cashout === "maya" && 
            <img src={maya} alt="Maya" className="h-8" />}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Account Name</p>
            <p className="font-medium">{data?.user.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Account Number</p>
            <p className="font-medium">{transaction.account_number}</p>
          </div>
          <div>
            <p className="text-gray-600">
                Paid Amount
            </p>
            <p className="font-medium">{formatCurrency(data?.amount)}</p>
          </div>
         
          <div>
            <p className="text-gray-600">Interest Rate</p>
            <p className="font-medium">{data?.loan.interest}%</p>
          </div>
          <div>
            <p className="text-gray-600">Total Interest</p>
            <p className="font-medium">{formatCurrency(totalInterest)}</p>
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
      </div>

      {/* Payment Schedule */}
      <div className="mb-6">
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
             
                <tr  className="border-t">
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
      </div>

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Principal Amount:</p>
          <p className="font-medium">{formatCurrency(data?.amount)}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Processing Fee:</p>
          <p className="font-medium">{formatCurrency(transaction.processing_fee)}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Total Interest:</p>
          <p className="font-medium">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <p>Total Amount to be Paid:</p>
          <p>{formatCurrency(data?.amount)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>Transaction ID: {transaction.id}</p>
        <p>Processed on: {new Date(transaction.timestamp).toLocaleString()}</p>
        <p className="mt-4">If you have any questions about this transaction, please contact our support.</p>
      </div>
    </div>
  );
};

export default TransactionDetail;