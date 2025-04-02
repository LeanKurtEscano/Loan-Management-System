import React from 'react'
import { useParams } from 'react-router-dom';
const TransactionDetails = () => {
    const { id } = useParams();
  return (
    <div>TransactionDetails</div>
  )
}

export default TransactionDetails