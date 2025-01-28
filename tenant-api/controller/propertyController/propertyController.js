const Property = require("../../models/propertyModel/property-model");
const Review = require("../../models/propertyModel/Review-model")
const jwt = require('jsonwebtoken');

//********************ADD PROPERTY*************************/

exports.addProperty = async (req, res) => {
  const { property_name, price, description, mobile_number, location, category,property_type} = req.body;

  console.log(req.body,"property_req.body")

  try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token)

    // Validate required fields
    if (!property_name || !price || !mobile_number) {
      return res.status(400).json({ status: false, message: "All required fields must be filled." });
    }

    if (req.files.length > 5) {
      return res.status(400).json({ status: false, message: "You can add only 5 photos" });
    }

    const property_photo = req?.files.map((file) => file.location);

    //Create a new property
    const newProperty = new Property({
      email: decoded.email,
      property_name,
      price,
      description,
      mobile_number,
      property_photo,
      location,
      category,
      property_type
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
    // Extract fields from the request body
    const { reviewerId, propertyId, rating, review_text } = req.body;

    // Validate required fields
    if (!reviewerId || !propertyId || !rating || !review_text) {
      return res.status(400).json({
        status: false,
        message: "All required fields (reviewerId, propertyId, rating, review_text) must be filled.",
      });
    }

    // Validate token and get user ID
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    const userId = decoded.id;

    // Validate rating value
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

    // Extract the single image URL from `req.file`
    const reviewImage = req.file ? req.file.location : null;

    // Create and save the new review
    const newReview = new Review({
      property: property._id, // or propertyId directly
      reviewerId: userId,
      rating,
      review_text,
      review_image: reviewImage ? reviewImage : "", // Store as an array
    });
    await newReview.save();

    // Add the rating to the property's rating array
    property.ratings.push({
      rating,
      reviewerId,
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
  const { min_price, max_price, rating, property_type, category } = req.body;
  console.log('Request Body:', req.body); // Log the incoming request body for testing

  try {
    // Build the query based on the provided filters
    let filterQuery = {};

    // Convert price to numbers and filter by price range if provided
    const minPrice = parseFloat(min_price);
    const maxPrice = parseFloat(max_price);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filterQuery.price = { $gte: minPrice, $lte: maxPrice };
    } else if (!isNaN(minPrice)) {
      filterQuery.price = { $gte: minPrice };
    } else if (!isNaN(maxPrice)) {
      filterQuery.price = { $lte: maxPrice };
    }

    // Filter by property type if provided
    if (property_type) {
      filterQuery.property_type = { $in: property_type};  // property_type is expected to be a string, not an array
    }

    // Filter by category if provided
    if (category) {
      filterQuery.category = { $in: category };  // category is expected to be a string, not an array
    }

    console.log('Final filter query:', filterQuery);

    // Retrieve properties based on the filter
    const properties = await Property.find(filterQuery);

    console.log('Found properties:', properties);

    // Filter properties based on rating if provided
    const filteredData = properties.filter((property) => {
      if (property.ratings && property.ratings.length > 0) {
        const sumRatings = property.ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);
        const averageRating = sumRatings / property.ratings.length;
        return averageRating >= rating; // Filter properties by rating
      }
      return rating === 0; // If no rating is set, return properties with no ratings
    });

    res.status(200).json({
      status: true,
      code: 200,
      data: properties,
    });
  } catch (error) {
    console.error("Error filtering properties:", error.message);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};


