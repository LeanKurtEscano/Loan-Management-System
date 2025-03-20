
import { 
    faUserGear, 
    faUsers, 
    faCreditCard, 
    faMoneyCheckDollar, 
    faIdCard, 
    faChartBar, 
    faFileInvoiceDollar, 
    faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";

export const menuItems = [
    { icon: faUserGear, text: "Manage Users", url: "/dashboard/manage-users" },
    { icon: faUsers, text: "Manage Borrowers", url: "/dashboard/manage-borrowers" },
    { icon: faIdCard, text: "User Verification", url: "/dashboard/user-verification" },
    { icon: faMoneyCheckDollar, text: "Loan Applications", url: "/dashboard/loan-applications" },
    { icon: faCreditCard, text: "Manage Payments", url: "/dashboard/repayments" },
    { icon: faSignOutAlt, text: "Logout" }
];


export const navMenuItems = [
    { name: "Transactions", path: "/my-transactions" },
    { name: "My Loans", path: "/my-loans" },
    { name: "Apply for Loan", path: "/apply-loan" },
];


export const formFields = [
    { id: "firstName", label: "First Name", type: "text", required: true },
    { id: "middleName", label: "Middle Name (Optional)", type: "text" },
    { id: "lastName", label: "Last Name", type: "text", required: true },
    { id: "age", label: "Age", type: "number", required: true, disabled: true },
    { id: "birthdate", label: "Birthdate", type: "date", required: true, min: new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split("T")[0], max: new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split("T")[0] },
    { id: "address", label: "Address", type: "text", required: true, placeholder: "e.g., 123 Rizal St., Barangay..." },
    { id: "contactNumber", label: "Contact Number", type: "tel", required: true },
    { id: "tinNumber", label: "TIN Number", type: "text", required: true },
  ];
  