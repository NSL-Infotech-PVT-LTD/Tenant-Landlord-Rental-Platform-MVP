import React from 'react';
import "./Navbar.css"

const Navbar = () => {
  return (
    <div className="navbar-main">
      
      <img src="/logo.png" alt="Logo" className="navbar-logo" />

      <ul className="navbar-option">
        <li><a href="/browse">Browse</a></li>
        <li><a href="/rent">Rent</a></li>
        <li><a href="/saved">Saved</a></li>
        <li><a href="/contact">Contactttttt</a></li>
      </ul>

    
      <div className="navbar-actions">
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search"
        />
        <button className="navbar-logout">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
