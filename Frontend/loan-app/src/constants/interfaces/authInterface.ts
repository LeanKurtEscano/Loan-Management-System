export interface OtpDetails {
    email:string;
    otpCode:string;
    password?:String;
  
}


export interface ResetPasswordInterface {
    email: string;
    password: string;
    confirm: string;
}