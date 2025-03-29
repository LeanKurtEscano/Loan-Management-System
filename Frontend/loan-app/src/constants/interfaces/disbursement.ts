interface amountDetails {
    period:string;
    amount: string;

}


export interface SubmitDisbursement {
   periodPayment: amountDetails[];
   receipt: File | null;
   email?: string;
}