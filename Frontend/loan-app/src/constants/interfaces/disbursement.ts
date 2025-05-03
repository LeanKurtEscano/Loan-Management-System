interface amountDetails {
    period:string;
    amount: string;

}


export interface SubmitDisbursement {
   disbursementId: number | null;
   periodPayment: amountDetails[];
   penalty?: boolean;
   receipt: File | null;
   email?: string;
}