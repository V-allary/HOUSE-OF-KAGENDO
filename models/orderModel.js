const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    customer: {

        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        }

    },

    items: [

        {

            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                default: 1
            },

            size: {
                type: String,
                default: ""
            },

            color: {
                type: String,
                default: ""
            },

            image: {
                type: String,
                default: ""
            }

        }

    ],

    subtotal: {
        type: Number,
        required: true
    },

    deliveryFee: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        required: true
    },

    deliveryAddress: {

        address: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        county: {
            type: String,
            default: ""
        }

    },

    paymentMethod: {
        type: String,
        default: ""
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );