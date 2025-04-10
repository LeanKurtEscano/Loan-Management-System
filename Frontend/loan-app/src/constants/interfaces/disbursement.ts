interface amountDetails {
    period:string;
    amount: string;

}


export interface SubmitDisbursement {
   disbursementId: number | null;
   periodPayment: amountDetails[];
   penalty?: number | null;
   receipt: File | null;
   email?: string;
}