export interface CarLoanDetails {
  id: string;
  car_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  loan_sale_price: number;
  commission_rate: number;
  date_offered: string;
  description: string;
  image_url: string;
}