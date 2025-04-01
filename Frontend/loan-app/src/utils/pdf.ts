import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatTime } from './formatDate';
import { formatDateWithWords } from './formatDate';
import { formatCurrency } from './formatCurrency';
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number; 
    };
  }
}

// Define the Transaction interface to match your data structure
interface User {
  username: string;
  contact_number: string;
}

interface LoanApp {
  interest: string;
}

interface Loan {
  loan_app: LoanApp;
  loan_amount: string;
  frequency: string;
  cashout: string;
}

interface Transaction {
  id: number;
  reference_id: string;
  amount: string;
  status: string;
  created_at: string;
  period: string;
  user: User;
  loan: Loan;
}

/**
 * Generates and downloads a PDF receipt for the transaction
 * @param transaction - The transaction data to format as a PDF
 */
export const downloadTransactionPDF = (transaction: Transaction): void => {
  const doc = new jsPDF();

  // ✅ Use transaction.id and add random letters to it for a professional reference ID
  const randomLetters = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 random letters
  const referenceId = `${transaction.id}-${randomLetters}`; 

  // ✅ Set a professional file name format
  const formattedDate = new Date(transaction.created_at).toISOString().split('T')[0]; 
  const pdfFileName = `Transaction_Receipt_${formattedDate}_${referenceId}.pdf`;

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Receipt', 105, 20, { align: 'center' });

  // Reference & Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference: ${transaction.reference_id}`, 20, 30);
  doc.text(
    `Date: ${formatDateWithWords(transaction.created_at)} ${formatTime(transaction.created_at)}`,
    20,
    35
  );

  // Transaction Status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Transaction Status: ${transaction.status}`, 20, 45);

  // Payment Details Table with Blue Background for Headers
  autoTable(doc, {
    startY: 55,
    head: [['Field', 'Details']],
    body: [
      ['Account Name', transaction.user.username],
      ['Account Number', transaction.user.contact_number],
      ['Paid Amount', formatCurrency(transaction.amount)],
      ['Interest Rate', `${transaction.loan.loan_app.interest}%`],
      ['Settlement Duration', transaction.period],
      ['Payment Frequency', transaction.loan.frequency],
      ['Payment Method', transaction.loan.cashout.toUpperCase()],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255], fontSize: 12 }, // Blue background for headers
  });

  // ✅ Get last table Y position safely
  const finalY = doc.lastAutoTable?.finalY || 65;

  // Payment Breakdown
  const paidAmount = parseFloat(transaction.amount || '0');
  const interestRate = parseFloat(transaction.loan.loan_app.interest || '0') / 100;
  const loanAmount = parseFloat(transaction.loan.loan_amount || '0');
  const totalInterest = loanAmount * interestRate;
  const interestPortion = (totalInterest / loanAmount) * paidAmount;
  const principalAmount = paidAmount - interestPortion;

  autoTable(doc, {
    startY: finalY + 10,
    head: [['Category', 'Amount']],
    body: [
      ['Principal Amount', formatCurrency(principalAmount.toString())],
      ['Total Interest', formatCurrency(interestPortion.toString())],
      ['Total Amount Paid', formatCurrency(transaction.amount)],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255], fontSize: 12 }, // Blue background for headers
  });

  const footerY = doc.lastAutoTable?.finalY || finalY + 20;

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Transaction ID: ${transaction.id || 'N/A'}`, 105, footerY + 10, { align: 'center' });
  doc.text(
    `Processed on: ${formatDateWithWords(transaction.created_at) || 'N/A'}`,
    105,
    footerY + 15,
    { align: 'center' }
  );
  doc.text(
    'If you have any questions about this transaction, please contact our support.',
    105,
    footerY + 20,
    { align: 'center' }
  );

  doc.save(pdfFileName);
};



export const printTransaction = (transaction: Transaction): void => {
  // Create a temporary iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.top = '-9999px';
  printFrame.style.left = '-9999px';
  document.body.appendChild(printFrame);

  const doc = printFrame.contentDocument;
  if (!doc) {
    console.error('Could not access iframe document');
    return;
  }

  // Calculate financial breakdown
  const paidAmount = parseFloat(transaction.amount || '0');
  const interestRate = parseFloat(transaction.loan.loan_app.interest || '0') / 100;
  const loanAmount = parseFloat(transaction.loan.loan_amount || '0');
  const totalInterest = loanAmount * interestRate;
  const interestPortion = (totalInterest / loanAmount) * paidAmount;
  const principalAmount = paidAmount - interestPortion;

  // Create the receipt HTML
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transaction Receipt - ${transaction.reference_id || transaction.id}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          background-color: #f8f9fa;
        }
        .container {
          width: 80%;
          margin: auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ddd;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0056b3;
          margin-bottom: 10px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 5px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          color: #fff;
          text-transform: uppercase;
        }
        .status-approved {
          background-color: #28a745;
        }
        .status-pending {
          background-color: #ffc107;
        }
        .status-rejected {
          background-color: #dc3545;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .table th, .table td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
        }
        .table th {
          background-color: #007bff;
          color: white;
        }
        .table td {
          background-color: #f9f9f9;
        }
        .totals {
          background-color: #f1f3f5;
          padding: 15px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Transaction Receipt</h1>
          <p>Reference: ${transaction.reference_id || 'N/A'}</p>
          <p>Date: ${formatDateWithWords(transaction.created_at)} ${formatTime(transaction.created_at)}</p>
          <div class="status-badge status-${transaction.status.toLowerCase()}">
            Transaction ${transaction.status}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Transaction Details</div>
          <div class="detail-row">
            <span class="label">Account Name:</span>
            <span>${transaction.user.username}</span>
          </div>
          <div class="detail-row">
            <span class="label">Account Number:</span>
            <span>${transaction.user.contact_number}</span>
          </div>
          <div class="detail-row">
            <span class="label">Paid Amount:</span>
            <span>${formatCurrency(transaction.amount)}</span>
          </div>
          <div class="detail-row">
            <span class="label">Interest Rate:</span>
            <span>${transaction.loan.loan_app.interest}%</span>
          </div>
          <div class="detail-row">
            <span class="label">Settlement Duration:</span>
            <span>${transaction.period}</span>
          </div>
          <div class="detail-row">
            <span class="label">Payment Frequency:</span>
            <span>${transaction.loan.frequency}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Schedule</div>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${formatDateWithWords(transaction.created_at)}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>
                  <div class="status-badge status-${transaction.status.toLowerCase()}">
                    ${transaction.status}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section totals">
          <div class="detail-row">
            <span class="label">Principal Amount:</span>
            <span>${formatCurrency(principalAmount.toString())}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total Interest:</span>
            <span>${formatCurrency(interestPortion.toString())}</span>
          </div>
          <div class="detail-row" style="border-top: 2px solid #ddd; padding-top: 10px; font-weight: bold;">
            <span>Total Amount Paid:</span>
            <span>${formatCurrency(transaction.amount)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Transaction ID: ${transaction.id || 'N/A'}</p>
          <p>Processed on: ${formatDateWithWords(transaction.created_at) || 'N/A'}</p>
          <p>If you have any questions about this transaction, please contact our support.</p>
        </div>
      </div>
    </body>
    </html>
  `);

  // Wait for content to load then print
  printFrame.onload = () => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } catch (error) {
      console.error('Error printing transaction:', error);
    }
  };

  doc.close();
};
