export interface LoanApplicationDetails {
    idNumber: string;
    employment: string;
    income: string;
    type?: number | null;
    plan?: number | null;
    amount:string;
}