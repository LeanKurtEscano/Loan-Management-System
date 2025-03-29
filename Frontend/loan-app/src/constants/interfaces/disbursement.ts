interface amountDetails {
    period:string;
    amount: string;

}


export interface SubmitDisbursement {
   disbursementId: number | null;
   periodPayment: amountDetails[];
   receipt: File | null;
   email?: string;
}