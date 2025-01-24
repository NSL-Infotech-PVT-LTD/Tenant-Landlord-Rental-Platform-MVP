import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    window.location.reload(); // Reloads the page after logout
  };

  return (
    <div className="navbar-main">
      {/* <img src="/logo.png" alt="Logo" className="navbar-logo" />
      <ul className="navbar-option">
        <li><a href="/browse">Browse</a></li>
        <li><a href="/rent">Rent</a></li>
        <li><a href="/saved">Saved</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul> */}

      <div className="navbar-actions">
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search"
        />
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
