import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

type FilterProps = {
  label?: string;
  toggle: boolean;
  onToggleChange: (value: boolean) => void;
};

const Filter: React.FC<FilterProps> = ({ label = "Filters", toggle, onToggleChange }) => {
  const handleToggleChange = () => {
    onToggleChange(!toggle); // Toggle the visibility state when clicked
  };

  return (
    <div className="relative inline-block mb-8">
      <details
        className="group"
        open={toggle}
        onClick={handleToggleChange} // Handle the toggle when clicked
      >
        <summary className="flex items-center gap-2 cursor-pointer px-4 py-2 border bg-white border-gray-300 shadow-2xl rounded-md hover:shadow transition select-none">
          <FontAwesomeIcon icon={faSliders} className="w-4 h-4" />
          <span className="text-sm font-medium">{label}</span>
        </summary>
      </details>
    </div>
  );
};

export default Filter;
