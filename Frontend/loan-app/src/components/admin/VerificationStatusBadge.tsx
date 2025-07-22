import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// Define the props interface
interface VerificationStatusBadgeProps {
  status: "verified" | "rejected" | "pending" | "not applied" | string;
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status }) => {
  let colorClass = "";
  let icon = null;

  switch (status) {
    case "verified":
      colorClass = "bg-green-100 text-green-800 border-green-200";
      icon = faCheckCircle;
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-800 border-red-200";
      icon = faExclamationTriangle;
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = faClock;
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800 border-gray-200";
      icon = faExclamationTriangle;
  }

  const displayText =
    status === "not applied"
      ? "Not Applied"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} border`}
    >
      <FontAwesomeIcon icon={icon} className="mr-1" />
      {displayText}
    </span>
  );
};

export default VerificationStatusBadge;
