import React, { useEffect, useState } from 'react';
import { Card, Button, CardBody, Modal, Form } from "react-bootstrap";
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { FaPhoneAlt, FaDollarSign } from 'react-icons/fa'; // Import icons
import "./Property.css";
import appUrl from "../../appUrl";

const PropertyList = () => {
  const AppUrl = appUrl();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem('propertyId') || '');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [propertyId, setPropertyId] = useState(localStorage.getItem('propertyId'));

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${AppUrl}/property`);
        if (response.data.code === 200) {
          setProperties(response.data.properties);

          // If no property is selected, set the first property as the default
          if (!selectedProperty && response.data.properties.length > 0) {
            setSelectedProperty(response.data.properties[0]._id);
            localStorage.setItem('propertyId', response.data.properties[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, [selectedProperty]);  // Ensure the selectedProperty is updated when properties change

  const handleCardSelect = (propertyId) => {
    setSelectedProperty(propertyId);
    localStorage.setItem('propertyId', propertyId); // Store the selected propertyId in localStorage
  };

  const handleAddReview = () => {
    const formData = new FormData();
    formData.append('review_text', newReview);
    formData.append('rating', rating);
    formData.append("propertyId",propertyId)
    // Append images
    selectedImages.forEach((image) => {
      formData.append('photos', image);
    });

    axios.post(`${AppUrl}/property/add-review`, formData)
      .then((response) => {
        if (response.data.status) {
          setReviews([...reviews, response.data.review]);  // Add the new review to the list
          setNewReview("");
          setRating(0);
          setSelectedImages([]);
          setShowReviewModal(false);
        }
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h5 className="mb-4">Search Results</h5>
      <div className="property-list row">
        {properties.map((property) => (
          <div className="col-md-4 mb-3" key={property._id}>
            <Card
              className={`property-card ${selectedProperty === property._id ? 'selected-card' : ''}`}
              onClick={() => handleCardSelect(property._id)}
            >
              <CardBody>
                <div className="d-flex">
                  <img
                    src={property.property_photo[0] || "/home/nsl/tenant/tenant-frontend/public/images/background.jpg"}
                    alt="property"
                    className="property-image"
                  />
                  <div className="ms-3">
                    <p>{property.location.location_name}</p>
                    <h6 className="property-title">{property.property_name}</h6>
                    <p className="property-description">{property.description}</p>

                    <div className="property-meta d-flex justify-content-between">
                      <p><FaDollarSign /> {property.price}</p>
                      <p><FaPhoneAlt /> {property.mobile_number}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p><strong>{property.reviews ? property.reviews.length : 0} review(s)</strong></p>
                      <Button variant="primary" onClick={() => setShowReviewModal(true)}>
                        Add a Review
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}

        {/* Add Review Modal */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="reviewText">
                <Form.Label>Write your review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="rating">
                <Form.Label>Rate this property</Form.Label>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      onClick={() => setRating(i + 1)}
                      color={i < rating ? "yellow" : "gray"}
                      className="star"
                    />
                  ))}
                </div>
              </Form.Group>
              <Form.Group controlId="reviewImages">
                <Form.Label>Upload images (optional)</Form.Label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <div className="selected-images">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${index}`}
                        className="image-thumb"
                      />
                      <Button variant="danger" onClick={() => handleDeleteImage(index)}>Delete</Button>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddReview}>
              Submit Review
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default PropertyList;
