// App.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import PropertyList from '../Components/PropertyList/PropertyList';
import { useAuth } from '../Store/auth';
import { RiArrowRightDoubleLine } from "react-icons/ri";
import EditProfile from './Auth/EditProfile';
import AddProperty from '../Components/PropertyList/AddProperty';

const Landlord = () => {

    const { sidebar, setSidebar } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="app-main">
            <Navbar onSearchChange={setSearchQuery} />
            <div className="homepage-main">
                <div>
                    <Sidebar />
                </div>
                <div className="property-main">
                    <Routes>
                        <Route path="/" element={<PropertyList searchQuery={searchQuery} />} />
                        <Route path="/edit-profile" element={<EditProfile/>} />
                        <Route path="/add-property" element={<AddProperty/>} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Landlord

