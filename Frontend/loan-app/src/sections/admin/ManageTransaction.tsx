import React from 'react'
import { useParams } from 'react-router-dom';
const ManageTransaction = () => {
    const { id } = useParams();
  return (
    <div>ManageTransaction</div>
  )
}

export default ManageTransaction