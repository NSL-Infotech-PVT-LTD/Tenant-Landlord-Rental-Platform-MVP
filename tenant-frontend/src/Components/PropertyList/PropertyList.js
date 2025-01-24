import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaDollarSign } from "react-icons/fa";
import "./Property.css";
import appUrl from "../../appUrl";

const PropertyList = () => {
  const AppUrl = appUrl();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("propertyId") || "");
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

  return (
    <>
      <ToastContainer />
      <div className="property-view-main">
        <h5 className="mb-4">Search Results</h5>
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="property-list">
            {properties.map((property) => {
              const userId = localStorage.getItem("userId");
              const hasReviewed = property.ratings.some(
                (rating) => rating.reviewerId === userId
              ); // Check if user has reviewed the property

              // Calculate the average rating for each property based on its individual ratings
              const averageRating = calculateAverageRating(property.ratings);

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
                    {!hasReviewed && ( // Only show button if the user hasn't reviewed
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

// import React, { useEffect, useState } from "react";
// import { Card, Button, Modal, Form, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaStar, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
// import "./Property.css";
// import appUrl from "../../appUrl";

// const PropertyList = () => {
//   const AppUrl = appUrl();
//   const [properties, setProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(localStorage.getItem("propertyId") || "");
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState("");
//   const [rating, setRating] = useState(0);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [reviewButton,setReviewButton] = useState(true)

//   // Function to fetch properties
//   const fetchProperties = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${AppUrl}/property`);
//       if (response.data.code === 200) {
//         const propertiesData = response.data.properties;
//         setProperties(propertiesData);
  
//         // Automatically select the first property if none is selected
//         if (!selectedProperty && propertiesData.length > 0) {
//           const firstPropertyId = propertiesData[0]._id.toString();
//           setSelectedProperty(firstPropertyId);
//           localStorage.setItem("propertyId", firstPropertyId); // Convert to string before saving
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   const handleCardSelect = (propertyId) => {
//     setSelectedProperty(propertyId);
//     localStorage.setItem("propertyId", propertyId);
//   };

//   const handleAddReview = async () => {
//     setLoading(true);
//     if (!newReview) {
//       setLoading(false);
//       return toast.error("Please enter a review");
//     }
//     if (!rating) {
//       setLoading(false);
//       return toast.error("Please provide a rating");
//     }
// const userId = localStorage.getItem("userId")
//     const formData = new FormData();
//     formData.append("review_text", newReview);
//     formData.append("rating", rating);
//     formData.append("propertyId", selectedProperty); // Ensure `selectedProperty` is valid
// formData.append("reviewerId", userId);
//     // selectedImages.forEach((photo) => {
//     //   formData.append("photos", photo);
//     // });

//     const tenantToken = localStorage.getItem("token");

//     if (!tenantToken) {
//       return toast.error("User is not authenticated. Please log in.");
//     }

//     try {
//       const response = await axios.post(`${AppUrl}/property/add-review`, formData, {
//         headers: {
//           Authorization: `Bearer ${tenantToken}`,
//         },
//       });

//       if (response.data.status) {
//         setReviews((prevReviews) => [...prevReviews, response.data.review]);
//         setNewReview("");
//         setRating(0);
//         setSelectedImages([]);
//         setShowReviewModal(false);
//         setLoading(false);
//         fetchProperties(); // Make sure this updates the properties list
//         toast.success("Review added successfully!");
//       } else {
//         toast.error(response.data.message || "Failed to add review.");
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Error adding review:", error);
//       toast.error("An error occurred while adding the review. Please try again.");
//     }
//   };


//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedImages(files);
//   };

//   const handleDeleteImage = (index) => {
//     setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
//   };

//   const calculateAverageRating = (ratings) => {
//     if (!Array.isArray(ratings) || ratings.length === 0) return 0; // Handle undefined or empty array
//     const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
//     return totalRating / ratings.length;
//   };
  
//   return (
//     <>
//       <ToastContainer />
//       <div className="property-view-main">
//         <h5 className="mb-4">Search Results</h5>
//         {loading ? (
//           <div className="spinner-container">
//             <Spinner animation="border" />
//           </div>
//         ) : (
//           <div className="property-list">
//           {properties.map((property) => {
//             const userId = localStorage.getItem("userId");
//             const hasReviewed = property.ratings.some(
//               (rating) => rating.reviewerId === userId
//             ); // Check if user has reviewed the property
        
//             const averageRating = calculateAverageRating(property.rating);
        
//             return (
//               <div className="col-md-4 mb-4" key={property._id}>
//                 <Card
//                   className={`property-card ${selectedProperty === property._id ? "selected-card" : ""}`}
//                   onClick={() => handleCardSelect(property._id)}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={property.property_photo.length > 0 ? property.property_photo[0] : "/images/background.jpg"}
//                     className="property-image"
//                   />
//                   <Card.Body className="property-body">
//                     <h6 className="property-title" title={property.property_name}>
//                       {property.property_name}
//                     </h6>
//                     <div className="property-meta">
//                       <p className="price">
//                         <FaDollarSign className="icon" /> {property.price}
//                       </p>
//                     </div>
//                     <p className="property-rating">
//                       Rating: {averageRating.toFixed(1)}
//                       {[...Array(5)].map((_, i) => (
//                         <FaStar
//                           key={i}
//                           color={i < averageRating ? "yellow" : "gray"}
//                         />
//                       ))}
//                     </p>
//                   </Card.Body>
//                   {!hasReviewed && ( // Only show button if the user hasn't reviewed
//                     (<Button
//                       className="review-button"
//                       variant="primary"
//                       onClick={() => setShowReviewModal(true)}
//                     >
//                       Add a Review
//                     </Button>)
//                   )}
//                 </Card>
//               </div>
//             );
//           })}
//         </div>
        
//         )}

//         {/* Review Modal */}
//         <Modal
//           show={showReviewModal}
//           onHide={() => setShowReviewModal(false)}
//           backdrop="static"
//         >
//           <Modal.Header>
//             <Modal.Title>Add a Review</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="modal-body-custom">
//             <Form>
//               <Form.Group controlId="reviewText">
//                 <Form.Label>Write your review</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={newReview}
//                   onChange={(e) => setNewReview(e.target.value)}
//                   className="mb-3"
//                 />
//               </Form.Group>
//               <Form.Group controlId="rating">
//                 <Form.Label>Rate this property</Form.Label>
//                 <div className="stars mb-3">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       onClick={() => setRating(i + 1)}
//                       color={i < rating ? "yellow" : "gray"}
//                       className="star"
//                     />
//                   ))}
//                 </div>
//               </Form.Group>
//               <Form.Group controlId="reviewImages">
//                 <Form.Label>Upload images (optional)</Form.Label>
//                 <input type="file" multiple onChange={handleImageChange} accept="image/*" className="mb-3" />
//                 <div className="selected-images">
//                   {selectedImages.map((img, index) => (
//                     <div key={index} className="image-preview">
//                       <img src={URL.createObjectURL(img)} alt={`preview-${index}`} className="image-thumb" />
//                       <Button variant="danger" onClick={() => handleDeleteImage(index)}>
//                         Delete
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button className="review-modal-button-cancel" onClick={() => { setShowReviewModal(false); setSelectedImages([]); setNewReview(""); setRating(0) }}>
//               Close
//             </Button>
//             {loading ? (
//               <Button className="review-modal-button-submit" onClick={handleAddReview}>
//                 <Spinner animation="border" />
//             </Button>
//             ) : (
//               <Button className="review-modal-button-submit" onClick={handleAddReview}>
//                 Submit Review
//               </Button>)}
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default PropertyList;
