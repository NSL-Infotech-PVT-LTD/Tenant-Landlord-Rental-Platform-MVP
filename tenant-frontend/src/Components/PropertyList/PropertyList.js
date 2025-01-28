import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../Store/auth";
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaDollarSign } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import ReactSlider from "react-slider";
import { useNavigate } from "react-router-dom";
import "./Property.css";
import appUrl from "../../appUrl";

const PropertyList = ({ searchQuery }) => {
  const AppUrl = appUrl();
  const navigate = useNavigate();
  const { isLandlord } = useAuth()
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("propertyId") || "");
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false); // Track filter state
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Function to fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    const userType = isLandlord ? "landlord":"tenant"
    const tenantToken = localStorage.getItem("token");
    try {
      const response = await axios.get(`${AppUrl}/property/${userType}`, {
        headers: {
          Authorization: `Bearer ${tenantToken}`, // Add the token to the Authorization header
        },
      });
      
      if (response.data.code === 200) {
        let propertiesData = response.data.properties;

        // If searchQuery exists, filter properties by property_name
        if (searchQuery) {
          propertiesData = propertiesData.filter(property =>
            property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProperties(propertiesData);

        // Automatically select the first property if none is selected
        if (!selectedProperty && propertiesData.length > 0) {
          const firstPropertyId = propertiesData[0]._id.toString();
          setSelectedProperty(firstPropertyId);
          localStorage.setItem("propertyId", firstPropertyId); // Convert to string before saving
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

  useEffect(() => {
    fetchProperties();
  }, [searchQuery]);

  const handleCardSelect = (propertyId) => {
    setSelectedProperty(propertyId);
    localStorage.setItem("propertyId", propertyId);
  };

  const handleAddReview = async () => {
    setLoading(true);
    if (!newReview) {
      setLoading(false);
      return toast.error("Please enter a review");
    }
    if (!rating) {
      setLoading(false);
      return toast.error("Please provide a rating");
    }

    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("review_text", newReview);
    formData.append("rating", rating);
    formData.append("propertyId", selectedProperty);
    formData.append("reviewerId", userId);

    const tenantToken = localStorage.getItem("token");

    if (!tenantToken) {
      return toast.error("User is not authenticated. Please log in.");
    }

    try {
      const response = await axios.post(`${AppUrl}/property/add-review`, formData, {
        headers: {
          Authorization: `Bearer ${tenantToken}`,
        },
      });

      if (response.data.status) {
        setNewReview("");
        setRating(0);
        setSelectedImages([]);
        setShowReviewModal(false);
        setLoading(false);
        fetchProperties(); // Make sure this updates the properties list
        toast.success("Review added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add review.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding review:", error);
      toast.error("An error occurred while adding the review. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Updated function to calculate average rating for each property
  const calculateAverageRating = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0; // Handle undefined or empty array
    const totalRating = ratings.reduce((acc, { rating }) => acc + rating, 0);
    return totalRating / ratings.length; // Return average of ratings
  };
  // Filter properties based on selected filters
  const filterProperties = () => {
    let filtered = properties;

    // Filter by price range
    filtered = filtered.filter(property =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(property =>
        calculateAverageRating(property.ratings) >= selectedRating
      );
    }

    // Filter by property type
    if (selectedType.length > 0) {
      filtered = filtered.filter(property => selectedType.includes(property.type));
    }

    // Filter by rooms
    if (selectedRooms.length > 0) {
      filtered = filtered.filter(property => selectedRooms.some(room => room === property.rooms));
    }

    setFilteredProperties(filtered);
  };

  // Update filter state and apply filter
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "rating") {
      setSelectedRating(checked ? value : 0);
    }

    if (name === "type") {
      if (checked) {
        setSelectedType([...selectedType, value]);
      } else {
        setSelectedType(selectedType.filter(item => item !== value));
      }
    }

    if (name === "rooms") {
      if (checked) {
        setSelectedRooms([...selectedRooms, value]);
      } else {
        setSelectedRooms(selectedRooms.filter(item => item !== value));
      }
    }

    filterProperties();
  };

  return (
    <>
      <ToastContainer />
      <div className="property-view-main">
        {isLandlord ? (
          <div className="property-header">
            <h5 className="mb-4">My properties</h5>
            <Button
              className="add-new" 
              onClick={()=>navigate("/home/landlord/add-property")}
              >
              Add New <FaPlus />
            </Button>
          </div>
        ) :
          (
            <div className="property-header">
              <h5 className="mb-4">Search Results</h5>
              <p
                className="filter-text"
                onClick={() => setActiveFilter(true)}>
                Filters <IoFilter />
              </p>
            </div>
          )}

        {activeFilter && (
          <div className="filter-main">
            <div className="close-filter mb-4">
              <IoIosCloseCircle onClick={() => setActiveFilter(false)} />
            </div>
            <h2>Price</h2>
            <ReactSlider
              min={0}
              max={10000}
              value={priceRange}
              onChange={(value) => setPriceRange(value)}
              step={1000}
              className="mb-3"
              renderTrack={(props, state) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    borderRadius: "5px",
                    background: "#ddd",
                  }}
                />
              )}
              renderThumb={(props, state) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    background: "#007bff",
                  }}
                />
              )}
            />
            <div className="price-range-labels mb-3">
              <span>{priceRange[0]}</span>
              <span>{priceRange[1]}</span>
            </div>


            <h2>Rating</h2>
            <div className="mb-3">
              {[1, 2, 3, 4].map((rate) => (
                <Form.Check
                  key={rate}
                  type="radio"
                  label={`${rate} and above`}
                  name="rating"
                  value={rate}
                  checked={selectedRating === rate}
                  onChange={handleFilterChange}
                />
              ))}
            </div>

            <h2>Type</h2>
            <Form.Check
              type="checkbox"
              label="Residential"
              value="Residential"
              name="type"
              checked={selectedType.includes("Residential")}
              onChange={handleFilterChange}
            />

            <Form.Check
              type="checkbox"
              label="Commercial"
              value="Commercial"
              name="type"
              className="mb-3"
              checked={selectedType.includes("Commercial")}
              onChange={handleFilterChange}
            />

            <h2>Rooms</h2>
            <div className="mb-3">
              {["1 BHK", "2 BHK", "3 BHK"].map((room) => (
                <Form.Check
                  key={room}
                  type="checkbox"
                  label={room}
                  value={room}
                  name="rooms"
                  checked={selectedRooms.includes(room)}
                  onChange={handleFilterChange}
                />
              ))}
            </div>

            <Button>Apply</Button>
          </div>
        )}

        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className={`property-list ${activeFilter ? "filter" : ""}`}>
            {properties.map((property) => {
              const userId = localStorage.getItem("userId");
              const hasReviewed = property.ratings.some(
                (rating) => rating.reviewerId === userId
              ); // Check if user has reviewed the property

              // Calculate the average rating for each property based on its individual ratings
              const averageRating = calculateAverageRating(property.ratings);

              return (
                <div className="col-md-4 mb-4 p-3" key={property._id}>
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
                      <p className="mb-2">
                        {property.description.length > 80
                          ? `${property.description.substring(0, 80)}...`
                          : property.description}
                      </p>

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
                    {!hasReviewed && !isLandlord && ( // Only show button if the user hasn't reviewed
                      <Button
                        className="review-button"
                        variant="primary"
                        onClick={() => setShowReviewModal(true)}
                      >
                        Add a Review
                      </Button>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        <Modal
          show={showReviewModal}
          onHide={() => setShowReviewModal(false)}
          backdrop="static"
        >
          <Modal.Header>
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
                  className="mb-3"
                />
              </Form.Group>
              <Form.Group controlId="rating">
                <Form.Label>Rate this property</Form.Label>
                <div className="stars mb-3">
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
                <input type="file" multiple onChange={handleImageChange} accept="image/*" className="mb-3" />
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
            <Button className="review-modal-button-cancel" onClick={() => { setShowReviewModal(false); setSelectedImages([]); setNewReview(""); setRating(0) }}>
              Close
            </Button>
            {loading ? (
              <Button className="review-modal-button-submit" onClick={handleAddReview}>
                <Spinner animation="border" />
              </Button>
            ) : (
              <Button className="review-modal-button-submit" onClick={handleAddReview}>
                Submit Review
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default PropertyList;