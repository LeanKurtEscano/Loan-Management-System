import React, { useState } from "react";
interface TermsProps {
    isChecked: boolean;
    handleCheckBoxChange: () => void;
}
const TermsCheckbox:React.FC<TermsProps> =  ({isChecked, handleCheckBoxChange}) => {
 

  return (
    <div className="p-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckBoxChange}
          className="h-5 w-5"
        />
        <span className="text-gray-700 font-medium">I agree to the Terms and Conditions</span>
      </label>
      
    </div>
  );
};

export default TermsCheckbox;