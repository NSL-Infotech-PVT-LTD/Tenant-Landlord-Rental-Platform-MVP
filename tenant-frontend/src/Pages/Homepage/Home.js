import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import PropertyList from '../../Components/PropertyList/PropertyList';
import PropertyDetails from '../../Components/PropertyList/PropertyDetails';

const Home = () => {
  return (
    <div className="app-main">
      <Navbar />
      <div className="homepage-main">
        <Sidebar />
        <div className="property-main">
          <PropertyList />
        </div>
      </div>
    </div>
  );
};

export default Home;
