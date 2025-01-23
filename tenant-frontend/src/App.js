import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth,AuthProvider } from './Store/auth';
import Home from "./Pages/Homepage/Home"
import "./App.css"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/" />;
};

function App() {
  const {isLoggedIn} = useAuth();

  return (
    <>
    <ToastContainer/>
    <Router>
        <Routes>
          <Route
            path='/'
            element={isLoggedIn ? <Navigate to="/home" /> : <Login/>}
          />
          <Route path='/home/*' element={<PrivateRoute component={Home}/>} />
      
        </Routes>
    </Router>
    </>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
