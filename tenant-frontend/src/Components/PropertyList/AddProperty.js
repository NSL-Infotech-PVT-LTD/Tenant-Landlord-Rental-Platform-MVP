import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/auth';
import { IoMdArrowBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import appUrl from '../../appUrl';

const AddProperty = () => {
  const navigate = useNavigate();
  const { isLandlord } = useAuth();
  const appurl = appUrl();

  // State to handle form inputs
  const [formData, setFormData] = useState({
    property_name: '',
    price: '',
    description: '',
    mobile_number: '',
    location_name: '',
    rooms: '',
    property_type: 'residential',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tenantToken = localStorage.getItem("token");
    const response = await fetch(`${appurl}/property/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.code === 201) {
      toast.success(data.message);
      navigate(isLandlord ? '/home/landlord/' : '/home/tenant/');
    } else {
      toast.error('Failed to add property');
    }
  };

  return (
    <>
    <ToastContainer/>
    <div>
      <div className="profile-head mb-4">
        <IoMdArrowBack onClick={() => navigate(isLandlord ? '/home/landlord/' : '/home/tenant/')} />
        <h4>Add New Property</h4>
        <p></p>
      </div>

      <Form className='property-form' onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col sm={12}>
            <Form.Label>Property Name</Form.Label>
            <Form.Control
              type="text"
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              required
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={6} sm={6}>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              className='mr-3'
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6} sm={6}>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Label>Location Name</Form.Label>
            <Form.Control
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={6} sm={6}>
            <Form.Label>Rooms</Form.Label>
            <Form.Control
              type="text"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
            />
          </Col>
          <Col lg={6} sm={6}>
            <Form.Label>Property Type</Form.Label>
            <Form.Control
              as="select"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </Form.Control>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Add Property
        </Button>
      </Form>
    </div>
    </>
  );
};

export default AddProperty;
