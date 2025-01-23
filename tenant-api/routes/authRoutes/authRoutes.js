const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../../middlewares/authentication");
const authController = require("../../controller/authController/authController");

// POST route for user signup
router.route("/signup").post(authController.userSignup);

// POST route for user login
router.route("/login").post(authController.userLogin);

// GET route for fetching the user's profile, requires authentication
router.route("/profile").get(authenticateUser, authController.getProfile);

module.exports = router;
