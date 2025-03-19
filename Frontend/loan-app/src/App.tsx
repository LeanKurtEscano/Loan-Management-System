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
import { logOutAdmin } from './services/admin/adminAuth';
import { useNavigate } from 'react-router-dom';
import UserProtectedRoutes from './Routes/UserProtectedRoutes';
import { getUserDetails } from './services/user/userData';

import { useEffect } from 'react';
import Loan from './sections/user/Loan';
import UsersLoanApplication from './sections/admin/UsersLoanApplication';
import VerifyApplication from './sections/admin/VerifyApplication';
function App() {

  return (
    <MyProvider>
      <Main />
    </MyProvider>
  );
}
const Main: React.FC = () => {
  const { toggleLog, setToggleLog, isAuthenticated, userDetails, isAdminAuthenticated, setUserDetails, setIsAdminAuthenticated } = useMyContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const handleGetUserDetails = async () => {
      const response = await getUserDetails();

      if (response.status === 200) {
        setUserDetails(response.data);
      }
    }
    handleGetUserDetails();

  }, [isAuthenticated, userDetails])

  {/* const { data, isLoading, isError, refetch } = useQuery<UserDetails>(
      ["userDetails"],
      getUserDetails,
      {
        onSuccess: (fetchedData) => {
          setUserDetails(fetchedData); 
        },
      }
    )*/}



  const isAdminRoute = location.pathname.startsWith("/dashboard");
  useTokenHandler();


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
          <Route path="verify/:id" element={<Verification />} />
          <Route path="verify/application/:id" element={<VerifyApplication />} />
        </Route>

        <Route
          path="/user"
          element={<UserProtectedRoutes />}
        >
          <Route path="my-loans" element={<Loan />} />
          <Route path="account" element={<Account />} />
          <Route path="apply-loan" element={<LoanApplication />} />
        </Route>




        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/email-verification" element={<EmailForm />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/otp-reset" element={<OtpReset />} />
        <Route path="/otp-register" element={<OtpRegister />} />
        <Route path="/register" element={<Register />} />


        <Route path="/reset-password" element={<ResetPassword />} />





      </Routes>

      {!isAdminRoute && <Footer />}

    </>

  );
};

export default App;
