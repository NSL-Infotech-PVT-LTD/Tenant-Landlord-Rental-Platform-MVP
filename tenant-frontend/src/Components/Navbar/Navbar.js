import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../../Store/auth";
import "./Navbar.css";

const Navbar = ({ onSearchChange }) => {
  const navigate = useNavigate()
  const { loggedUser, isLandlord } = useAuth()
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.location.reload(); // Reloads the page after logout
  };

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="navbar-main">
      <div className="navbar-actions">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          className="navbar-search"
          onChange={handleSearchChange}
        />

        <Button
          variant="light"
          className='user-profile'
          onClick={() => isLandlord ? navigate("/home/landlord/edit-profile") : navigate("/home/tenant/edit-profile")}
        >
          {loggedUser.username}
          {loggedUser.profile_photo ?
            (<img src={loggedUser.profile_photo} alt="" />)
            : <img src='/images/dummy.jpg' />}
        </Button>

        <button
          className="navbar-logout"
          onClick={() => setShowModal(true)}
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to logout?</h2>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={handleLogout}
              >
                Confirm
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
