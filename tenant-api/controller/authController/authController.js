const mongoose = require("mongoose");
const User = require("../../models/authModels/auth-model");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Utility functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobileNumber = (number) => number.toString().length >= 10 && number.toString().length <= 15;


//********************SIGN UP*************************/
exports.userSignup = async (req, res) => {
    const { username, password, email, mobile_number,license_number, whats_app, country,user_type } = req.body;

    try {
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({ status: false, message: "All required fields must be filled." });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ status: false, message: "Invalid email format." });
        }

        if (mobile_number && !validateMobileNumber(mobile_number)) {
            return res.status(400).json({ status: false, message: "Invalid mobile number length." });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,// Hash password here before saving
            email,
            mobile_number,
            license_number,
            whats_app,
            country,
            user_type
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, username: newUser.username },
            process.env.JWT_SECRET
            // { expiresIn: '1h' } // Token expiration time
        );

        res.status(201).json({
            status: true,
            code: 201,
            message: "User signed up successfully",
            token:token,
            data:newUser,
            role:user_type
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ status: false, message: "Internal server error." });
    }
};


//********************LOG IN*************************/

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email and password
        if (!email) {
            return res.status(400).json({ status: false, code: 400, message: "Email is required." });
        }

        if (!password) {
            return res.status(400).json({ status: false, code: 400, message: "Password is required." });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ status: false, code: 404, message: "User not found." });
        }

        // Compare the hashed password with the provided password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, code: 400, message: "Incorrect password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email, username: existingUser.username },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Login successful",
            email: existingUser.email,
            token,
            data: existingUser
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ status: false, code: 500, message: "Internal server error." });
    }
};


//********************GET PROFILE*************************/

exports.getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.decode(token)
        const userId = decoded.id

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User ID is required",
            });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            status: true,
            code: 200,
            message: "User profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

//********************Edit PROFILE*************************/

exports.editProfile = async (req, res) => {
    try {
        console.log(req.body, "req.body");
        console.log(req.file, "req.file");

        // Extract the token and decode it to get the user ID
        const token = req.headers.authorization?.split(" ")[1]; // Assumes "Bearer <token>"
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.id;
        console.log(userId, "userId");

        // Allowed fields for updates
        const allowedUpdates = ["username", "profile_photo"];

        // Prepare the update object
        const updates = {};

        // Add username to updates if provided
        if (req.body.username) {
            updates.username = req.body.username;
        }

        // Add profile_photo URL to updates if a file is uploaded
        if (req.file) {
            updates.profile_photo = req.file.location; // The URL generated by multer-s3
        }

        // Validate that only allowed fields are being updated
        const updatesKeys = Object.keys(updates);
        const isValidOperation = updatesKeys.every(key => allowedUpdates.includes(key));

        if (!isValidOperation) {
            return res.status(400).json({ status: false, message: "Invalid fields in update request." });
        }

        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: false, message: "User not found." });
        }

        res.status(200).json({
            status: true,
            code: 200,
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ status: false, message: "Internal server error." });
    }
};

