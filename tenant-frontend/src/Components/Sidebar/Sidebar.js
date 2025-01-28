import React, { useState } from 'react';
import './Sidebar.css';
import { FaHome } from 'react-icons/fa';
import { useAuth } from '../../Store/auth';
import { useNavigate } from 'react-router-dom';
import { PiBuildingApartmentBold } from 'react-icons/pi';
import { MdOutlineApartment } from 'react-icons/md';
import { LuLandPlot } from 'react-icons/lu';

const propertyOptions = [
  { id: 1, icon: <FaHome />, name: 'Home' },
  // { id: 2, icon: <PiBuildingApartmentBold />, name: 'Apartment' },
  // { id: 3, icon: <MdOutlineApartment />, name: 'Commercial' },
  // { id: 4, icon: <LuLandPlot />, name: 'Land Plot' },
];

const Sidebar = () => {

  const navigate = useNavigate();
  const { isLandlord } = useAuth()

  return (
    <div className="sidebar-main">
      <div>
        <h6>Property Type</h6>
      </div>
      <div className="sidebar-options">
        {propertyOptions.map((option) => (
          <div
            className="sidebar-name"
            key={option.id}
            onClick={() => isLandlord ? navigate("/home/landlord") : navigate("/home/tenant")}
          >
            {option.icon}
            <p>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
