import './App.css';
import { useMyContext } from './context/MyContext';
import { MyProvider } from './context/MyContext';
import useTokenHandler from './hooks/useTokenHandler';
import { Routes, Route } from 'react-router-dom';
import Login from './sections/user/Login';
import OtpVerification from './sections/user/OtpVerification';
import Home from './sections/user/Home';
import AdminLogin from './sections/admin/AdminLogin';
import ForgotPassword from './sections/user/ForgotPassword';
import EmailForm from './sections/user/EmailForm';
function App() {
 
  return (
    <MyProvider>
      <Main />
    </MyProvider>
  );
}
const Main: React.FC = () => {

  useTokenHandler();
 
  return (

    <>
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/email-verification" element={<EmailForm/>} />
       <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/otp-verify" element={<OtpVerification />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
     </Routes>
      
    </>

  );
};

export default App;
