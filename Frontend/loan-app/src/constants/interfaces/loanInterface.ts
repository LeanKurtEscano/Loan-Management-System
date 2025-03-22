export interface LoanApplicationDetails {
    front: File | null;
    back: File | null;
    idType: string;
    educationLevel: string;
    employment: string | null;
    totalIncome:string
    sourceOfIncome:string;
    otherSourcesofIncome?:string;
    frequency:string;
    primarySource:string;
    moneyReceive:string;
    totalSpend:string;
    outstanding:string
    purpose: string | null;
    explanation:string;
}