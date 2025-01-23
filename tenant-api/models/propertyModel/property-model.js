const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    property_name: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    description: {
        type: String,
    },
    mobile_number: {
        type: String,
        trim: true
    },
    property_photo: [{
        type: String,
    }],
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
    },
    rating: {
        type: [Number],
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Property", propertySchema);
