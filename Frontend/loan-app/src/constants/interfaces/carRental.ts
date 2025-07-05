export interface CarData {
  id: number;
  car_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  commission_rate: number;
  date_offered: string;
  description: string;
  image_url: string;
  license_plate: string;
  loan_sale_price: number;
}

export interface LoanApplication {
  id: number;
  car_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthdate: string;
  city: string;
  company_name: string;
  complete_address: string;
  created_at: string;
  down_payment: string;
  email_address: string;
  employment_type: string;
  existing_loans: boolean;
  gender: string;
  is_active: boolean;
  job_title: string;
  loan_amount: string;
  loan_term: string;
  marital_status: string;
  monthly_income: string;
  other_income: string;
  phone_number: string;
  status: string;
  user: number;
  years_employed: string;
}



export interface CarData {
  id: number;
  car_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  commission_rate: number;
  date_offered: string;
  description: string;
  image_url: string;
  license_plate: string;
  loan_sale_price: number;
}

export interface LoanApplication {
  id: number;
  car_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthdate: string;
  city: string;
  company_name: string;
  complete_address: string;
  created_at: string;
  down_payment: string;
  email_address: string;
  employment_type: string;
  existing_loans: boolean;
  gender: string;
  is_active: boolean;
  job_title: string;
  loan_amount: string;
  loan_term: string;
  marital_status: string;
  monthly_income: string;
  other_income: string;
  phone_number: string;
  status: string;
  user: number;
  years_employed: string;
}