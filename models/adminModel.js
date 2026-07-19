// ==========================================
// ADMIN MODEL
// ==========================================

const mongoose = require("mongoose");

const adminSchema =
    new mongoose.Schema(
        {

            name: {

                type: String,

                required: true,

                trim: true

            },

            email: {

                type: String,

                required: true,

                unique: true,

                lowercase: true,

                trim: true

            },

            password: {

                type: String,

                required: true

            },

            role: {

                type: String,

                default: "admin",

                enum: [
                    "admin"
                ]

            },

            active: {

                type: Boolean,

                default: true

            }

        },

        {

            timestamps: true

        }

    );


// Prevent password from being returned
// automatically in normal queries.

adminSchema.set(
    "toJSON",
    {

        transform: function (
            document,
            returnedObject
        ) {

            delete returnedObject.password;

            return returnedObject;

        }

    }
);


module.exports =
    mongoose.model(
        "Admin",
        adminSchema
    );