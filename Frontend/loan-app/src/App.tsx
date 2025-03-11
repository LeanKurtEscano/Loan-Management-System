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
function App() {

  return (
    <MyProvider>
      <Main />
    </MyProvider>
  );
}
const Main: React.FC = () => {
  const { setIsAuthenticated, isAdminAuthenticated} = useMyContext();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/dashboard");
  useTokenHandler();
  console.log("Access Token:", localStorage.getItem("admin_token"));
  console.log(isAdminAuthenticated);

  return (

    <>
      {!isAdminRoute && <NavBar />}

      <Routes>

        <Route
          path="/dashboard/*"
          element={
            <AdminProtectedRoutes>
              <Dashboard />
            </AdminProtectedRoutes>
          }
        >
          <Route path="user-verification" element={<UserVerification />} />

        </Route>


        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verification" element={<EmailForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/otp-verify" element={<OtpVerification />} />
        <Route path="/otp-reset" element={<OtpReset />} />
        <Route path="/otp-register" element={<OtpRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/apply-loan" element={<LoanApplication />} />

      </Routes>

      {!isAdminRoute && <Footer />}

    </>

  );
};

export default App;
