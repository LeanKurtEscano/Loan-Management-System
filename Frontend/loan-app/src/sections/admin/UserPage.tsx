import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';



const UserPage: React.FC = () => {
 
  return (
   <>
       <Outlet />
   </>
      
  );
};

export default UserPage;
