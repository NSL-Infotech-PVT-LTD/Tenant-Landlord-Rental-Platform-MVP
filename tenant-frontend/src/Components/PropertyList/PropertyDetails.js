import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import "./Property.css";
import appUrl from "../../appUrl";

const PropertyDetails = () => {
  const AppUrl = appUrl();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [propertyId, setPropertyId] = useState(localStorage.getItem('propertyId'));


  // const propertyId = localStorage.getItem('propertyId');

  // Function to trigger custom event
  // function triggerLocalStorageEvent(key, value) {
  //   const event = new CustomEvent('localStorageChange', { detail: { key, value } });
  //   window.dispatchEvent(event);
  // }

  // // Override localStorage.setItem
  // const originalSetItem = localStorage.setItem;

  // localStorage.setItem = function (key, value) {
  //   originalSetItem.apply(this, arguments); // Call the original setItem method
  //   triggerLocalStorageEvent(key, value);  // Trigger the custom event
  // };

  // // Add Event Listener for custom event
  // window.addEventListener('localStorageChange', (event) => {
  //   const { key, value } = event.detail;
  //   console.log(`Key changed: ${key}, New value: ${value}`);
  // });


  useEffect(() => {
    if (propertyId) {
      const fetchPropertyDetails = async () => {
        try {
          const response = await axios.get(`${AppUrl}/property/${propertyId}`);
          if (response.data.status) {
            setProperty(response.data.property);
            setReviews(response.data.property.reviews); // Set reviews from the API
          } else {
            console.log("Error: Property not found");
          }
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      };

      fetchPropertyDetails();
    } else {
      console.log("No propertyId found in localStorage");
    }
  }, [propertyId]);

  const handleAddReview = () => {
    const formData = new FormData();
    formData.append('review_text', newReview);
    formData.append('rating', rating);

    // Append images
    selectedImages.forEach((image) => {
      formData.append('review_images', image);
    });

    axios.post(`${AppUrl}/property/${propertyId}/review`, formData)
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
    <div className="property-detail">
      {property ? (
        <>
          <img
            src={property.property_photo[0]}
            alt={property.property_name}
            className="property-image"
          />
          <div className="property-header">
            <div className="property-info">
              <h2>{property.property_name}</h2>
              <p>{property.description}</p>
              <p><strong>Price:</strong> ${property.price}</p>
              <p><strong>Contact:</strong> {property.mobile_number}</p>
              <p><strong>Email:</strong> {property.email}</p>
            </div>
          </div>

          <div className="reviews-section">
            <h4>Reviews</h4>
            {reviews?.length > 0 ? (
              reviews.map((review, index) => (
                <Card key={index} className="review-card">
                  <Card.Body>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? "yellow" : "gray"} />
                      ))}
                    </div>
                    <p>{review.review_text}</p>
                    {review.review_images.length > 0 && (
                      <div className="review-images">
                        {review.review_images.map((image, i) => (
                          <img key={i} src={image} alt={`review-img-${i}`} className="review-image" />
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No reviews yet. Be the first to add a review!</p>
            )}
          </div>

          <Button variant="primary" onClick={() => setShowReviewModal(true)}>
            Add a Review
          </Button>

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
        </>
      ) : (
        <p>Loading property details...</p>
      )}
    </div>
  );
};

export default PropertyDetails;