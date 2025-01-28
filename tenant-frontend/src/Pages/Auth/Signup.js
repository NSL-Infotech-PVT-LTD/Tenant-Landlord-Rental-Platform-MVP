import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../../Store/auth";
import appUrl from "../../appUrl";
import "./Login.css";

const Signup = () => {
  const AppUrl = appUrl();
  const location = useLocation();
  const navigate = useNavigate();
  const [isTenant, setIsTenant] = useState(false); // Track if it's tenant signup
  const [isLoading, setIsLoading] = useState(false);
  const { storeTokenInLS, setIsLoggedIn,setIsLandlord} = useAuth();

  const [signup, setSignup] = useState({
    username: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
    address: "",
    license_number: "",
    checkbox: false,
    user_type: "", // Will be set dynamically
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check URL path to determine the user type
  useEffect(() => {
    if (location.pathname.includes("tenant-signup")) {
      setIsTenant(true);
      setSignup((prev) => ({ ...prev, user_type: "tenant" }));
    } else if (location.pathname.includes("landlord-signup")) {
      setIsTenant(false);
      setSignup((prev) => ({ ...prev, user_type: "landlord" }));
    }
  }, [location.pathname]);

  const handleShowPassword = () => setShowPassword(true);
  const handleHidePassword = () => setShowPassword(false);

  const handleShowConfirmPassword = () => setShowConfirmPassword(true);
  const handleHideConfirmPassword = () => setShowConfirmPassword(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignup((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!signup.email || !signup.password) {
      setIsLoading(false);
      toast.error("Email and Password are required!");
      return;
    }

    if (signup.password !== signup.confirm_password) {
      setIsLoading(false);
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${AppUrl}/user/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signup),
      });

      const data = await response.json();
      if (data.code === 201) {
        localStorage.setItem("userId", data.data._id);
        storeTokenInLS(data.token);
        localStorage.setItem("role",data.role)
        if(data.role === "tenant"){
            setIsLandlord(false)
            console.log("role")
        };
        setIsLoggedIn(true);
        setIsLoading(false);
        toast.success("Signup successful!");
      } else {
        toast.error(data.message || "An error occurred!");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup">
        <div className="signup-card">
          <p className="description mb-3">
            Signup as {isTenant ? "Tenant" : "Landlord"}
          </p>
          <div className="signup-width">
            <form onSubmit={handleSignup}>
              <div className="signup-form">
                {/* Username */}
                <div className="signup-fields mb-2">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={signup.username}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* Email */}
                <div className="signup-fields mb-2">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={signup.email}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* Phone number */}
                <div className="signup-fields mb-2">
                  <label htmlFor="mobile_number">Phone Number</label>
                  <input
                    type="number"
                    id="mobile_number"
                    name="mobile_number"
                    value={signup.mobile_number}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                {/* License number */}
                {!isTenant && (
                  <div className="signup-fields mb-2">
                    <label htmlFor="license_number">License Number</label>
                    <input
                      type="number"
                      id="license_number"
                      name="license_number"
                      value={signup.license_number}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="signup-fields mb-2">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={signup.password}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {showPassword ? (
                    <IoEyeOutline
                      className="eye"
                      onClick={handleHidePassword}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="eye"
                      onClick={handleShowPassword}
                    />
                  )}
                </div>

                {/* Confirm Password */}
                <div className="signup-fields mb-2">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={signup.confirm_password}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {showConfirmPassword ? (
                    <IoEyeOutline
                      className="eye"
                      onClick={handleHideConfirmPassword}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="eye"
                      onClick={handleShowConfirmPassword}
                    />
                  )}
                </div>
              </div>
              <div className="SignUp-button mb-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="loader">Signing Up....</div>
                  ) : (
                    <p>
                      Signup
                      <IoIosArrowForward />
                    </p>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
