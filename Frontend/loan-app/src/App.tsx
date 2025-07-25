import './App.css';
import { useMyContext } from './context/MyContext';
import { MyProvider } from './context/MyContext';
import useTokenHandler from './hooks/useTokenHandler';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './sections/user/Login';
import OtpVerification from './sections/user/OtpVerification';
import Home from './sections/user/Home';
import AdminLogin from './sections/admin/AdminLogin';
import EmailForm from './sections/user/EmailForm';
import OtpReset from './sections/user/OtpReset';
import ResetPassword from './sections/user/ResetPassword';
import NavBar from './layout/user/NavBar';
import Register from './sections/user/Register';
import OtpRegister from './sections/user/OtpRegister';
import Footer from './layout/user/Footer';
import Account from './sections/user/Account';
import LoanApplication from './sections/user/LoanApplication';
import AdminProtectedRoutes from './Routes/AdminProtectedRoutes';
import Dashboard from './sections/admin/Dashboard';
import UserVerification from './sections/admin/UserVerification';
import Verification from './sections/admin/Verification';
import { logOutAdmin, ResetAdminPassword } from './services/admin/adminAuth';
import { useNavigate } from 'react-router-dom';
import UserProtectedRoutes from './Routes/UserProtectedRoutes';
import { getUserDetails } from './services/user/userData';
import Terms from './sections/user/Terms';
import { useEffect } from 'react';
import Loan from './sections/user/Loan';
import UsersLoanApplication from './sections/admin/UsersLoanApplication';
import VerifyApplication from './sections/admin/VerifyApplication';
import UserPage from './sections/admin/UserPage';
import PrivacyPolicy from './sections/user/PrivacyPolicy';
import { useQuery } from '@tanstack/react-query';
import { getLoanApplication } from './services/user/userData';
import ManageBorrowers from './sections/admin/ManageBorrowers';
import ApproveSubmission from './sections/admin/ApproveSubmission';
import ManagePayments from './sections/admin/ManagePayments';
import VerifyPayment from './sections/admin/VerifyPayment';
import UserLoan from './sections/user/UserLoan';
import TransactionDetail from './sections/user/TransactionDetail';
import ManageTransaction from './sections/admin/ManageTransaction';
import Analytics from './sections/admin/Analytics';
import ManageUsers from './sections/admin/ManageUsers';
import User from './sections/admin/User';
import Support from './sections/user/Support';
import NotificationPage from './components/Notification';
import NotificationDetail from './sections/user/NotificationDetail';
import Help from './sections/user/Help';
import AdminEmail from './sections/admin/AdminEmail';
import AdminResetOTP from './sections/admin/AdminResetOTP';
import AdminResetPassword from './sections/admin/AdminResetPassword';
import AdminNotificationPage from './components/admin/AdminNotificationPage';
import AdminNotificationDetails from './components/admin/AdminNotificationDetails';
import CarList from './sections/rental/CarListing';
import AutoGarageHomepage from './sections/rental/AutoGarageHomePage';
import ApplyCarLoan from './sections/rental/ApplyCarLoan';
import RentalApplications from './sections/admin/RentalApplications';
import VerifyCarApplication from './sections/admin/VerifyCarApplication';
import ManageRentals from './sections/admin/ManageRentals';
import Disbursements from './sections/admin/Disbursements';
import CarLoan from './sections/user/CarLoan';
import { MyCarProvider } from './context/CarContext';
import VerifyCarPayment from './sections/admin/VerifyCarPayment';
import UserCarPayments from './sections/user/UserCarPayments';
function App() {

  return (
    <MyProvider>
      <MyCarProvider>
         <Main />

      </MyCarProvider>
     
    </MyProvider>
  );
}
const Main: React.FC = () => {
  const { toggleLog, setToggleLog, isAuthenticated, userDetails,setIsAuthenticated, isAdminAuthenticated, setUserDetails, setIsAdminAuthenticated } = useMyContext();
  const location = useLocation();



  useTokenHandler();

  useEffect(() => {

    const handleGetUserDetails = async () => {
      const response = await getUserDetails();

      if (response.status === 200) {
        setUserDetails(response.data);
      }
    }
    handleGetUserDetails();

  }, [isAuthenticated, userDetails])



  const isAdminRoute = location.pathname.startsWith("/dashboard");
 
  console.log(localStorage.getItem("access_token"))
  

  return (

    <>
      {!isAdminRoute && <NavBar />}

      <Routes>

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/dashboard/*"
          element={
            <AdminProtectedRoutes>
              <Dashboard />
            </AdminProtectedRoutes>
          }
        >
          <Route path="user-verification" element={<UserVerification />} />
          <Route path="loan-applications" element={<UsersLoanApplication />} />
          <Route path="manage-borrowers" element={<ManageBorrowers />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-payments" element={<ManagePayments />} />
          <Route path="verify/:id" element={<Verification />} />
          <Route path="verify/application/:id" element={<VerifyApplication />} />
          <Route path="submission/approve/:id" element={<ApproveSubmission />} />
          <Route path="users/:id" element={<User />} />
          <Route path="submission/user-transaction/:id" element={<ManageTransaction />} />
          <Route path="payment/approve/:id" element={<VerifyPayment />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="rental-applications" element={<RentalApplications />} />
          <Route path="manage-rentals" element={<ManageRentals />} />
          <Route path="disbursement/:id" element={<Disbursements />} />
           <Route path="disbursement/payments/:id" element={<VerifyCarPayment />} />
            
          <Route path="car-application/:id/:carId" element={<VerifyCarApplication />} />

          <Route path="admin/notifications" element={<AdminNotificationPage />} />
          <Route path="admin-notifications/:id" element={<AdminNotificationDetails/>} />
        </Route>

        <Route
          path="/user"
          element={<UserProtectedRoutes>
             <UserPage/>
            </UserProtectedRoutes>
            }
        >
          <Route path="my-loan" element={<Loan />} />
          <Route path="my-transactions" element={<UserLoan/>} />
           <Route path="car-transactions" element={<UserCarPayments/>} />
          <Route path="my-transactions/:id" element={<TransactionDetail/>} />
           <Route path="my-car-transactions/:id" element={<TransactionDetail/>} />
          <Route path="account" element={<Account />} />
          
          <Route path="apply-loan" element={<LoanApplication />} />
          <Route path="apply-car-loan" element={<AutoGarageHomepage />} />
          <Route path="car-list" element={<CarList />} />
           <Route path="car-list/:id" element={<ApplyCarLoan />} />
            <Route path="my-car-loan" element={<CarLoan />} />
        </Route>


  

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />

        <Route path="/admin-email-verification" element={<AdminEmail />} />
        <Route path="/admin-otp-reset-verify" element={<AdminResetOTP />} />

        <Route path="/email-verification" element={<EmailForm />} />
        <Route path="/notifications" element={<NotificationPage/>} />
        <Route path="/notifications/:id" element={<NotificationDetail/>} />
   
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/otp-reset" element={<OtpReset />} />
        <Route path="/otp-register" element={<OtpRegister />} />
        <Route path="/register" element={<Register />} />

    
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/reset-admin-password" element={<AdminResetPassword />} />
        
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        





      </Routes>

      {!isAdminRoute && <Footer />}

    </>

  );
};

export default App;
