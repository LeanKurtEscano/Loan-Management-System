import './App.css';
import { useMyContext } from './context/MyContext';
import { MyProvider } from './context/MyContext';
import useTokenHandler from './hooks/useTokenHandler';
import { Routes, Route } from 'react-router-dom';
import Login from './sections/user/Login';
import OtpVerification from './sections/user/OtpVerification';
import Home from './sections/user/Home';
import AdminLogin from './sections/admin/AdminLogin';
import EmailForm from './sections/user/EmailForm';
import OtpReset from './sections/user/OtpReset';
import ResetPassword from './sections/user/ResetPassword';
import NavBar from './layout/user/NavBar';
import Register from './sections/user/Register';
function App() {
 
  return (
    <MyProvider>
      <Main />
    </MyProvider>
  );
}
const Main: React.FC = () => {
 const {setIsAuthenticated} = useMyContext();
 setIsAuthenticated(false);
  useTokenHandler();
 
  return (

    <>
     <NavBar/>
  
      <Routes>
     
      <Route path="/" element={<Home />} />
       <Route path="/login" element={<Login />} />
       <Route path="/email-verification" element={<EmailForm/>} />
       <Route path="/reset-password" element={<ResetPassword/>} />
       <Route path="/admin-login" element={<AdminLogin />} />
       <Route path="/otp-verify" element={<OtpVerification />} />
       <Route path="/otp-reset" element={<OtpReset/>} />
       <Route path="/register" element={<Register/>} />
      
     </Routes>
      
    </>

  );
};

export default App;
