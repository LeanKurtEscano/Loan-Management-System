import React from 'react'
import { useQuery } from '@tanstack/react-query'

const CarLoan = () => {


  const { data, isLoading, error } = useQuery(["carLoanDisbursement"], 
   
  );
  return (
    <div>CarLoan</div>
  )
}

export default CarLoan