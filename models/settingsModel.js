const mongoose = require("mongoose");

const settingsSchema =
new mongoose.Schema({

    storeName: {
        type: String,
        default: "House of Kagendo"
    },

    storeEmail: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports =
mongoose.model(
    "Settings",
    settingsSchema
);