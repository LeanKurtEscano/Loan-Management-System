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
    contact_number?: string;
    address?: string;
    is_verified: boolean;
}


export interface VerifyData {
    firstName: string;
    middleName?: string;
    lastName: string;
    address: string;
    age: string;
    birthdate: string;
    contactNumber: string;
    image: File | null;  // Allow null
}
