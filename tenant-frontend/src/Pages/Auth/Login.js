import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Button } from 'react-bootstrap';
import { IoIosArrowForward } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../Store/auth';
import appUrl from '../../appUrl';
import "./Login.css"

const Login = () => { 
    const AppUrl = appUrl();
    const [emailfill,setemailfill]=useState(true);
    const [passfill,setpassfill]=useState(true);
    const [notific,setnotific]=useState(true);
    const { storeTokenInLS, setIsLoggedIn,setIsLandlord } = useAuth();
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        email: "",
        password: "",
    })

    useEffect(() => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    },[]);

    console.log(login.password, "password===0")

    const [isLoading, setIsLoading] = useState(false);
    console.log(login)

    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(true);
    };

    const handleHidePassword = () => {
        setShowPassword(false);
    };

    const handleLogInput = (e) => {
        const { name, value, type, checked } = e.target || {};
        if(name === 'email'){
            setemailfill(true);
        }
        if(name === 'password'){
            setpassfill(true);
        }
        if(name === 'email'){setemailfill(true)}
        setLogin((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? "1" : "") : value,
        }));
    };

    const handleLog = async (e) => {
        if(!login.email){
            setemailfill(false);
        }
        if(!login.password){
            setpassfill(false);
        }
        e.preventDefault();
        setIsLoading(true);
        if (!login.email || !login.password) {
            setIsLoading(false);
            setnotific(false);
        }
        else {
            try {
                const response = await fetch(`${AppUrl}/user/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(login)
                });
                console.log('Server response:', response);

                const data = await response.json();

                console.log("this data here",data);
                if (data.code === 200) {
                    localStorage.setItem("userId",data.data._id)
                    localStorage.setItem("role",data.data.user_type)
                    if(data.data.user_type === "tenant"){
                        setIsLandlord(false)
                        console.log("role")
                    };
                    storeTokenInLS(data.token);
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    console.log("Login successful");
                    console.log("data", data);
                }
                else if (data.code === 400) {
                    console.log("in this is");
                    toast.error(data.message)
                    // setLogin({
                    //     email: '',
                    //     password: '',
                    // })
                    setIsLoading(false);
                }
                else {
                    toast.error(data.message)
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <>
           <ToastContainer />
            <div>
                <div className='signup'>
                    <div className='signup-card'>

                        <div className='welcome-head'>
                            <h1>Welcome</h1>
                        </div>
                        <p className='description mb-3'>Log in to your account</p>
                        <div className='signup-width'>
                            <form onSubmit={handleLog} >
                                <div className='signup-form mb-3'>
                                    <div className='signup-fields mb-3'>
                                        <label htmlFor="email">EMAIL</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={login.email}
                                            onChange={handleLogInput}
                                            autoComplete="off"
                                        />
                                    </div>
                                    {!emailfill && <p style={{color:'red'}}>Email Is Required</p>}
                                    <div className='signup-fields password_set_wrap mb-4'>
                                        <label htmlFor="password">PASSWORD</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={login.password}
                                            onChange={handleLogInput}
                                            className='passwordTyping'
                                            autoComplete="off"
                                        />
                                        {showPassword ? (
                                            <IoEyeOutline className='eye' onClick={handleHidePassword} />
                                        ) : (
                                            <IoEyeOffOutline className='eye' onClick={handleShowPassword} />
                                        )}
                                    </div>
                                    {!passfill && <p style={{color:'red'}}>Password Is Required</p>}
                                    
                                    <div className='SignUp-button mb-3'>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <div className="loader">Loading...</div>
                                            ) : (
                                                <p>Log in<IoIosArrowForward /></p>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            <div>
                                <p className='already mb-2'>
                                    Don’t have an account ? 
                                </p>
                                </div>
                                <div className='create-new-main'>
                                    <Button className='create-new' variant='light'
                                     onClick={() => navigate('/tenant-signup')}>
                                   Sign up as a Tenant
                                </Button>
                                <Button className='create-new' variant='light'
                                 onClick={() => navigate('/landlord-signup')}>
                                   Sign up as a Landlord
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Login
