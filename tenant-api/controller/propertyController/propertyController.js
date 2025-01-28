const Property = require("../../models/propertyModel/property-model");
const Review = require("../../models/propertyModel/Review-model")
const jwt = require('jsonwebtoken');

//********************ADD PROPERTY*************************/

exports.addProperty = async (req, res) => {
  const { property_name, price, description, mobile_number, location } = req.body;
  console.log(req.body)
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token)
    // Validate required fields
    if (!property_name || !price || !mobile_number) {
      return res.status(400).json({ status: false, message: "All required fields must be filled." });
    }
    // if (req.files.length > 5) {
    //   return res.status(400).json({ status: false, message: "You can add only 5 photos" });
    // }
    // const property_photo = req?.files.map((file) => file.location);
    // console.log(property_photo, "nxsjxsnxjsnxnsxnsxnsj");
    // Create a new property
    const newProperty = new Property({
      email: decoded.email,
      property_name,
      price,
      description,
      mobile_number,
      // property_photo,
      location
    });

    await newProperty.save();

    res.status(201).json({
      status: true,
      code: 201,
      message: "Property added successfully",
      property: newProperty
    });
  } catch (error) {
    console.error("Error adding property:", error.message);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

//********************FETCH ALL PROPERTIES*************************/

exports.getProperties = async (req, res) => {
  const { userType } = req.params; // Correctly access req.params
  console.log("userType",userType)
  try {
  
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token);

    let properties;

    if (userType === "landlord") {
      properties = await Property.find({ email: decoded.email });
    } else {
      properties = await Property.find();
    }

    res.status(200).json({
      status: true,
      code: 200,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

//********************FETCH SINGLE POST*************************/

exports.getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1) Find the property by its ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        status: false,
        message: "Property not found",
      });
    }

    // 2) Find all reviews referencing this property
    //    (Property._id becomes the "property" field in the Review model)
    const reviews = await Review.find({ property: id })
    // (Optional) If you want to populate the reviewer (e.g. name/email) from 'User':
    // .populate("reviewerId", "name email")

    return res.status(200).json({
      status: true,
      property,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

//********************ADD REVIEW*************************/

exports.addReview = async (req, res) => {
  try {
    // Fields from the request body
    const { reviewerId, propertyId, rating, review_text } = req.body;

    // Validate required fields
    if (!reviewerId || !propertyId || !rating || !review_text) {
      // if ( !propertyId || !rating || !review_text) {
      return res.status(400).json({
        status: false,
        message: "All required fields (reviewerId, propertyId, rating, review_text) must be filled.",
      });
    }

    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token)
    const userId = decoded.id

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ status: false, message: "Rating must be between 1 and 5." });
    }

    // Check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ status: false, message: "Property not found" });
    }

    // Extract image URLs from req.files (uploaded by multer-s3)
    // Each file has a 'location' property which is the public URL
    if (req.files.length > 5) {
      return res
        .status(404)
        .json({ status: false, message: "Only 5 images are accepted" });
    }
    const reviewImages = req.files.map((file) => file.location);
    console.log(reviewImages, "dccdkcmdckdcmkcmdkc");
    // Create and save the new review
    const newReview = new Review({
      property: property._id, // or propertyId directly
      reviewerId: userId,
      rating,
      review_text,
      review_images: reviewImages,
    });
    await newReview.save();
    // Add the rating to the property's rating array
    // Add review to the ratings array
    property.ratings.push({
      rating,
      reviewerId
    });

    // Save updated property
    await property.save();

    return res.status(201).json({
      status: true,
      code: 201,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

//*********************************************/

exports.filterProperties = async (req, res) => {
  const { min_price, max_price, rating, property_type, rooms } = req.body;
  console.log('Request Body:', req.body); // Log the incoming request body for testing

  try {
    // Build the query based on the provided filters
    let filterQuery = {};

    // Filter by price range if provided
    if (min_price && max_price) {
      filterQuery.price = { $gte: min_price, $lte: max_price };
    } else if (min_price) {
      filterQuery.price = { $gte: min_price };
    } else if (max_price) {
      filterQuery.price = { $lte: max_price };
    }

    // Filter by property type if provided
    if (property_type) {
      filterQuery.property_type = property_type;
    }

    // Filter by number of rooms if provided
    if (rooms) {
      filterQuery.rooms = rooms;
    }

    // Retrieve all properties
    const properties = await Property.find(filterQuery);

    // Filter properties where the average rating is greater than or equal to the specified rating
    const filteredData = properties.filter((property) => {
      if (property.ratings && property.ratings.length > 0) {
        const sumRatings = property.ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);
        const averageRating = sumRatings / property.ratings.length;
        return averageRating >= rating; // Filter if average rating is >= the provided rating
      }
      return false; // If no ratings, exclude the property
    });

    res.status(200).json({
      status: true,
      code: 200,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error filtering properties:", error.message);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};
