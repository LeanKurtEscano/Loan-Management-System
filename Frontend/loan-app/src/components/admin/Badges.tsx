import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBan,faSort,faSortUp,faSortDown } from "@fortawesome/free-solid-svg-icons";
import { SortIconProps } from "../../constants/interfaces/components";
export const GoodPayerBadge: React.FC = () => {
  return (
    <>
      <span className="inline-flex items-center ml-2 px-1 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
      </span>
    </>
  );
};

export const BlacklistedBadge: React.FC = () => {
  return (
    <>
      <span className="inline-flex items-center ml-2 px-1 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <FontAwesomeIcon icon={faBan} className="text-red-600" />
      </span>
    </>
  );
};


export const SortIcon: React.FC<SortIconProps> = ({ column, sortConfig }) => {
    if (!sortConfig || sortConfig.key !== column) {
        return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400 opacity-70" />;
    }
    return sortConfig.direction === 'asc'
        ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-600" />
        : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-600" />;
};