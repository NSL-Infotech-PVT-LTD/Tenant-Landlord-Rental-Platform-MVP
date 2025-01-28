import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth, AuthProvider } from "./Store/auth";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import EditProfile from "./Pages/Auth/EditProfile";
import "./App.css";
import Tenant from "./Pages/Tenant";
import Landlord from "./Pages/Landlord";

function App() {
  const { isLoggedIn, isLandlord } = useAuth();

  const protectRoute = (element, condition) => (condition ? element : <Navigate to="/" />);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
          <Route path="/tenant-signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
          <Route path="/landlord-signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup />} />
          <Route path="/home" element={isLoggedIn ? <Navigate to={isLandlord ? "/home/landlord" : "/home/tenant"} /> : <Navigate to="/" />} />
          <Route path="/home/landlord/*" element={protectRoute(<Landlord />, isLoggedIn && isLandlord)} />
          <Route path="/home/tenant/*" element={protectRoute(<Tenant />, isLoggedIn && !isLandlord)} />
        </Routes>
      </Router>
    </>
  );
}

//problem is when i sign in as tenant and logout and again sign in as landlord then redirecting to /home/tenant/ but on refresh redirected to /home/landlord/ 

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
