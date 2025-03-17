import React, { useState } from 'react';
import Sidebar from '../../layout/admin/Sidebar';
import { Outlet } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';
const Dashboard: React.FC = () => {
  const { toggle } = useMyContext();

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <Sidebar  />

      {/* Main Content */}
      <div
        className={`transition-all duration-500 flex-1 ${
          toggle ? 'ml-16' : 'ml-64'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
