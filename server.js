require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const NewsletterSubscriber =
require("./models/userModel");

const user =
require("./models/userModel");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
  
// MIDDLEWARE

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());


// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect(process.env.MONGODB_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((error) => {

    console.log(error);

});

// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {

    res.send("House of KA API Running");

});

// =========================
// SIGNUP ROUTE
// =========================

app.post("/signup", async (req, res) => {

    console.log("Signup request received");
    console.log(req.body);

    try {
        

        const {

            firstName,
            lastName,
            email,
            password

        } = req.body;

        // CHECK IF USER EXISTS

        const existingUser =
        await User.findOne({ email });

        if(existingUser){

            return res.status(400).json({

                message:
                "User already exists"

            });

        }

        // HASH PASSWORD

        const hashedPassword =
        await bcrypt.hash(password, 10);

        // CREATE USER

        const user =
        new User({

            firstName,

            lastName,

            email,

            password:
            hashedPassword

        });

        await user.save();

        res.status(201).json({

            message:
            "Account created successfully"

        });

    } catch(error){

        console.log(error);

        res.status(500).json({

            message:
            "Server error"

        });

    }

});

// =========================
// NEWSLETTER SUBSCRIBE
// =========================

app.post("/subscribe", async (req, res) => {

    try{

        const { email } = req.body;

        const existingSubscriber =
        await NewsletterSubscriber.findOne({
            email
        });

        if(existingSubscriber){

            return res.status(400).json({

                message:
                "You are already subscribed."

            });

        }

        const subscriber =
        new NewsletterSubscriber({

            email

        });

        await subscriber.save();

        res.status(201).json({

            message:
            "Welcome to House of KA."

        });

    }catch(error){

        console.log(error);

        res.status(500).json({

            message:
            "Server error"

        });

    }

});
// =========================
// START SERVER
// =========================

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(

        `Server running on port ${PORT}`

    );

});