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
    category: 'residential',
    property_type: '1BHK',
    property_photo:null
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevProfile => ({
      ...prevProfile,
      property_photo: file // Store the file object itself
    }));
  };

  const handleDeleteImage = (e) => {
    e.preventDefault()
    // e.stopPropagation();
    setFormData({ ...formData, property_photo: null });
    const input = document.getElementById('imageInput');
    input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object
    const formDataToSend = new FormData();
    
    // Append fields from your formData state
    formDataToSend.append('property_name', formData.property_name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('mobile_number', formData.mobile_number);
    formDataToSend.append('location_name', formData.location_name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('property_type', formData.property_type);
  
    // Append the image file if it exists
    if (formData.property_photo) {
      formDataToSend.append('photos', formData.property_photo);
    }
  
    const tenantToken = localStorage.getItem('token');
  
    try {
      const response = await fetch(`${appurl}/property/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tenantToken}`,
        },
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (data.code === 201) {
        toast.success(data.message);
        navigate(isLandlord ? '/home/landlord/' : '/home/tenant/');
      } else {
        toast.error(data.message || 'Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  
  return (
    <>
      <ToastContainer />
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
              <Form.Label>Property Type</Form.Label>
              <Form.Control
                as="select"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
              >
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
              </Form.Control>
            </Col>
            <Col lg={6} sm={6}>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </Form.Control>
            </Col>
          </Row>

          <h5 className='mb-2'>Upload Image</h5>
          <div className='upload-image mb-5'>
            <div className="image-container">
              <div onClick={() => document.getElementById('imageInput').click()}>
                {formData.property_photo ? (
                  <div className='uploaded'>
                    <img src={URL.createObjectURL(formData.property_photo)} alt="project" className='project-image' />
                    {/* <img src='/images/pdf.png' alt='pdf' /> */}
                  </div>
                ) : (
                  <div>
                    <img src='/images/upload.png' className='mb-2' alt="Upload" />
                    <h3 className='mb-2'>Drag and Drop files, or Browse</h3>
                    <p>Upload only a image up to a maximum size of 10MB</p>
                  </div>
                )}
              </div>
              {formData.property_photo && (
                <button className="delete-image-btn" onClick={handleDeleteImage}>✕</button>
              )}
            </div>
            <input
              type="file"
              id="imageInput"
              accept="image/"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <Button variant="primary" type="submit">
            Add Property
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddProperty;
