const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    }, 

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    images: {
        type: [String],
        default: []
    },

    sizes: {
        type: [String],
        default: []
    },

    colors: {
        type: [String],
        default: []
    },

    stock: {
        type: Number,
        default: 0
    },

    featured: {
        type: Boolean,
        default: false
    },

    bestseller: {
        type: Boolean,
        default: false
    },

    newArrival: {
        type: Boolean,
        default: true
    },

    sale: {
        type: Boolean,
        default: false
    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);