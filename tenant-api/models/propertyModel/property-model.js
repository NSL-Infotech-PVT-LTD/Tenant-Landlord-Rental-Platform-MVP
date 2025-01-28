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
    property_type:{
       type: String,
       enum:[residential,commercial]
    },
    rooms:{
      type:String
    },
    // rating: {
    //     type: [Number],
    // },
    ratings: [{
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Property", propertySchema);
