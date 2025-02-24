const express = require("express");
const router = express.Router();
const { addProperty, getProperties, getPropertyById ,addReview,filterProperties} = require("../../controller/propertyController/propertyController");
const  upload  =require('../../middlewares/multer')
const {authenticateUser} = require("../../middlewares/authentication")
// POST route to add property
router.post("/add", authenticateUser,upload.array("photos", 5), addProperty);

// GET route to list all properties
router.get("/:userType",authenticateUser, getProperties);

// GET route to get property by ID
router.get("/:id", getPropertyById);

//add review
router.post("/add-review",authenticateUser, upload.single("photos"),addReview);

//filter properties
router.post("/filter", authenticateUser,filterProperties);

module.exports = router;
