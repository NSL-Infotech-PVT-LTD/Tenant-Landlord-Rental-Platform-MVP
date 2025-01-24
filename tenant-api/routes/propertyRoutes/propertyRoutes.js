const express = require("express");
const router = express.Router();
const { addProperty, getProperties, getPropertyById ,addReview} = require("../../controller/propertyController/propertyController");
const  upload  =require('../../middlewares/multer')
const {authenticateUser} = require("../../middlewares/authentication")
// POST route to add property
router.post("/add", upload.array("photos", 5), addProperty);

// GET route to list all properties
router.get("/", getProperties);

// GET route to get property by ID
router.get("/:id", getPropertyById);

router.post("/add-review",authenticateUser, upload.array("photos", 5), addReview);

module.exports = router;
