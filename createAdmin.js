require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin =
    require("./models/adminModel");

async function createAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB Connected"
        );

        const email =
            "houseofka@gmail.com";

        const existingAdmin =
            await Admin.findOne({
                email
            });

        if (existingAdmin) {

            console.log(
                "Admin account already exists."
            );

            return;

        }

        const hashedPassword =
            await bcrypt.hash(
                "HouseOfKa2026",
                12
            );

        const admin =
            new Admin({

                name:
                    "House of Kagendo Administrator",

                email,

                password:
                    hashedPassword,

                role:
                    "admin",

                active:
                    true

            });

        await admin.save();

        console.log(
            "Admin account created successfully."
        );

    } catch (error) {

        console.error(
            "Create admin error:",
            error
        );

    } finally {

        await mongoose.disconnect();

        process.exit();

    }

}

createAdmin();