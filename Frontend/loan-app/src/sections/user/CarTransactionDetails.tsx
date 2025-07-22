import React from 'react'
import { getCarPaymentDetail } from '../../services/rental/carDisbursement';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
const CarTransactionDetails = () => {

    const { numId } = useParams();

      const { data: carData, isLoading: carLoading, isError: carError } = useQuery(
        ["userCarTransactions", numId], 
        () => getCarPaymentDetail(numId)
       
      );

       console.log(carData, "carData from CarTransactionDetails");
  return (
    <div>CarTransactionDetails</div>
  )
}

export default CarTransactionDetails