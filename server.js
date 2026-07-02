require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true}));

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

/* ===============================
   EMAIL TRANSPORTER (ONCE)
================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
 
 /* ===============================
   CONTACT FORM ENDPOINT
================================ */
app.post("/submit-form", async (req, res) => {
    // Honeypot spam protection
    if (req.body.website) {
      return res.status(200).json({ success: true });
    }
  
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();
  
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }
  
    try {
      await transporter.sendMail({
        from: `"House of KA Website" <${process.env.EMAIL_USER}>`,
        to: "houseofk.a254@gmail.com",
        replyTo: email,
        subject: `Website Message: ${subject}`,
        html: `
          <h3>New Message from House of Kagendo Website</h3>
  
          <p><strong>Name:</strong> ${name}</p>
  
          <p><strong>Email:</strong> ${email}</p>
  
          <p><strong>Subject:</strong> ${subject}</p>
  
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `
      });
  
      return res.status(200).json({
        success: true,
        message: "Message sent successfully."
      });
  
    } catch (error) {
      console.error("Email send error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later."
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
            "Welcome to House of Kagendo."

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