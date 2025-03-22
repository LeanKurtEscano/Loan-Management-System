export interface ApplicationData {
    id:number;
    first_name:string;
    middle_name: string;
    last_name: string;
    birthdate: string;
    age: number;
    contact_number: string;
    address: string;
    gender: string;
    marital_status: string;
    postal_code: string;
    status: string;
    created_at: string;
    user: number
  
}


export interface ApplicationId {
    id:number;
    user?:number;
}