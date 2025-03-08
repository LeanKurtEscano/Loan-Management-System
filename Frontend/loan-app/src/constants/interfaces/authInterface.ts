export interface OtpDetails {
    email:string;
    otpCode:string;
    password?:String;
    username? : String;
  
}


export interface ResetPasswordInterface {
    email: string;
    password: string;
    confirm: string;
}


export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword:string;
}