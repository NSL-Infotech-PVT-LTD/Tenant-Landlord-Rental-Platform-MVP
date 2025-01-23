const Property = require("../../models/propertyModel/property-model");





//********************ADD PROPERTY*************************/

exports.addProperty = async (req, res) => {
  const { property_name, price, description, mobile_number, email, location } = req.body;

  try {
    // Validate required fields
    if (!property_name || !price || !mobile_number) {
      return res.status(400).json({ status: false, message: "All required fields must be filled." });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ status: false, message: "You can add only 5 photos" });
    }
    const property_photo = req?.files.map((file) => file.location);
    console.log(property_photo, "nxsjxsnxjsnxnsxnsxnsj");
    // Create a new property
    const newProperty = new Property({
      email,
      property_name,
      price,
      description,
      mobile_number,
      property_photo,
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
  try {
    const properties = await Property.find();
    res.status(200).json({
      status: true,
      code: 200,
      properties
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
    const { propertyId, rating, review_text } = req.body;
    // Suppose req.userId is set by authentication middleware
    // const reviewerId = req.userId;

    // Validate required fields
    // if (!reviewerId || !propertyId || !rating || !review_text) {
      if (!propertyId || !rating || !review_text) {
      return res.status(400).json({
        status: false,
        message: "All required fields ( propertyId, rating, review_text) must be filled.",
      });
    }

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
      // reviewerId,
      rating,
      review_text,
      review_images: reviewImages,
    });

    await newReview.save();

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
;

