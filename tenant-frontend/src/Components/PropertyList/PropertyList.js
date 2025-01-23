import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import "./Property.css";
import appUrl from "../../appUrl";

const PropertyList = () => {
  const AppUrl = appUrl();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("propertyId") || "");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${AppUrl}/property`);
      if (response.data.code === 200) {
        const propertiesData = response.data.properties;
        setProperties(propertiesData);

        // Automatically select the first property if none is selected
        if (!selectedProperty && propertiesData.length > 0) {
          setSelectedProperty(propertiesData[0]._id);
          localStorage.setItem("propertyId", propertiesData[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleCardSelect = (propertyId) => {
    setSelectedProperty(propertyId);
    localStorage.setItem("propertyId", propertyId);
  };

  const handleAddReview = async () => {
    const formData = new FormData();
    formData.append("review_text", newReview);
    formData.append("rating", rating);
    formData.append("propertyId", selectedProperty);

    selectedImages.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await axios.post(`${AppUrl}/property/add-review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status) {
        setReviews([...reviews, response.data.review]);
        setNewReview("");
        setRating(0);
        setSelectedImages([]);
        setShowReviewModal(false);
        fetchProperties();
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
    return totalRating / ratings.length;
  };

  return (
    <div>
      <h5 className="mb-4">Search Results</h5>
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="property-list">
          {properties.map((property) => {
            const averageRating = calculateAverageRating(property.rating);
            return (
              <div className="col-md-4 mb-4" key={property._id}>
                <Card
                  className={`property-card ${selectedProperty === property._id ? "selected-card" : ""}`}
                  onClick={() => handleCardSelect(property._id)}
                >
                  <Card.Img
                    variant="top"
                    src={property.property_photo.length > 0 ? property.property_photo[0] : "/images/background.jpg"}
                    className="property-image"
                  />
                  <Card.Body className="property-body">
                    <h6 className="property-title" title={property.property_name}>
                      {property.property_name}
                    </h6>
                    {/* <p className="property-location">
                      <FaMapMarkerAlt className="icon" /> {property.location.location_name}
                    </p> */}
                    {/* <p className="property-description">{property.description}</p> */}
                    <div className="property-meta">
                      <p className="price">
                        <FaDollarSign className="icon" /> {property.price}
                      </p>
                    </div>
                    <p className="property-rating">
                      Rating: {averageRating.toFixed(1)}
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < averageRating ? "yellow" : "gray"}
                        />
                      ))}
                    </p>
                  </Card.Body>
                  <Button
                    className="review-button"
                    variant="primary"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Add a Review
                  </Button>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
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
              <input type="file" multiple onChange={handleImageChange} accept="image/*" />
              <div className="selected-images">
                {selectedImages.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={URL.createObjectURL(img)} alt={`preview-${index}`} className="image-thumb" />
                    <Button variant="danger" onClick={() => handleDeleteImage(index)}>
                      Delete
                    </Button>
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
  );
};

export default PropertyList;
