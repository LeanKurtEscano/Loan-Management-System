export interface OtpDetails {
    email: string;
    otpCode: string;
    password?: String;
    username?: String;

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
    confirmPassword: string;
}

export interface UserDetails {

    id: number;
    username: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email: string;
    admin?: boolean;
    contact_number?: string;
    address?: string;
    is_verified: string;
}

export interface VerifiedUserDetails {

    id: number;
    first_name: string;
    middle_name?: string; 
    suffix?: string; 
    last_name: string;
    age: number;
    birthdate: string; 
    contact_number: string;
    gender: string;
    marital_status: string;
    postal_code:string;
    address: string;
    status: string;
}



export interface VerifyData {
    firstName: string;
    middleName?: string;
    lastName: string;
    address: string;
    age: string;
    birthdate: string;
    contactNumber: string;
    gender: string;
    civilStatus: string;
    postalCode: string;
    suffix?: string;
     
}
