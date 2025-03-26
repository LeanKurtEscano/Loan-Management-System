export interface LoanApplicationDetails {
    front: File | null;
    back: File | null;
    idType: string;
    educationLevel: string;
    employmentStatus: string | null;
    monthlyIncome: string;
    incomeVariation: string;
    primaryIncomeSource: string;
    otherSourcesOfIncome?: string[]; 
    incomeFrequency: string;
    primarySource: string;
    moneyReceive: string;
    totalSpend: string;
    outstanding: string;
    purpose: string | null;
    explanation: string;
  }

export interface AdminApprove {
  loanAmount: number | null;
  interest: number | null;
}

export interface LoanSubmission {
  loanId: number | null;
  paymentFrequency: string;
  loanAmount: number |  null;
  repayDate: string;
  idSelfie: File | null;
  cashout: string;
  totalPayment:number;

}