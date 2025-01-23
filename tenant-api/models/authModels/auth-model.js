const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        trim: true
    },
    profile_photo: {
        type: String,
    },
    whats_app: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true,
        lowercase: true
    },
    location: {
        location_name: { 
            type: String 
        },
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
            default: null
        },
        updatedAt: { 
            type: Date, 
            default: Date.now 
        }
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("User", authSchema);