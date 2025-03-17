
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