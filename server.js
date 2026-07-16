require("dotenv").config(); 
const multer = require("multer");
const path = require ("path");
const product = require ("./models/ProductModel");


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
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
  
// MIDDLEWARE

app.use(cors({
    origin: [
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3000",
        "https://v-allary.github.io"
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

// =========================================
// MULTER CONFIGURATION
// =========================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

      cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

      cb(

          null,

          Date.now() +

          path.extname(file.originalname)

      );

  }

});

const upload = multer({

  storage

});

// Serve uploaded images

app.use("/uploads", express.static("uploads"));

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

// CREATE TOKEN

const token = jwt.sign(

    {

        id: user._id

    },

    process.env.JWT_SECRET,

    {

        expiresIn: "7d"

    }

);

// SEND USER BACK

res.status(201).json({

    message: "Account created successfully",

    token,

    user: {

        id: user._id,

        firstName: user.firstName,

        lastName: user.lastName,

        email: user.email

    }

});

    } catch(error){

        console.log(error);

        res.status(500).json({

            message:
            "Server error"

        });

    }

});

// =========================================
// CREATE PRODUCT
// =========================================

app.post(
  "/products",
  
  upload.array("images",10),
  
  async(req,res)=>{
  
  try{
  
  const{
  
  name,
  description,
  category,
  price,
  stock,
  sizes,
  colors,
  featured
  
  }=req.body;
  
  const images =
  req.files.map(file=>
  
  `/uploads/${file.filename}`
  
  );
  
  const product =
  new Product({
  
  name,
  
  description,
  
  category,
  
  price,
  
  stock,
  
  images,
  
  sizes:
  JSON.parse(sizes),
  
  colors:
  JSON.parse(colors),
  
  featured:
  featured==="true"
  
  });
  
  await product.save();
  
  res.status(201).json({
  
  message:
  "Product added successfully."
  
  });
  
  }catch(error){
  
  console.log(error);
  
  res.status(500).json({
  
  message:
  "Failed to add product."
  
  });
  
  }
  
  });

// =========================================
// GET PRODUCTS
// =========================================

app.get("/products",async(req,res)=>{

  try{
  
  const products =
  await Product.find()
  
  .sort({
  
  createdAt:-1
  
  });
  
  res.json(products);
  
  }catch(error){
  
  res.status(500).json({
  
  message:"Server Error"
  
  });
  
  }
  
  });
// =========================================
// DELETE PRODUCT
// =========================================

app.delete("/products/:id", async (req, res) => {

  try {

      await Product.findByIdAndDelete(req.params.id);

      res.json({

          message: "Product deleted successfully."

      });

  } catch (error) {

      res.status(500).json({

          message: "Delete failed."

      });

  }

});

// =========================================
// UPDATE PRODUCT
// =========================================

app.put("/products/:id", async (req, res) => {

  try{
  
  const updatedProduct =
  
  await Product.findByIdAndUpdate(
  
  req.params.id,
  
  req.body,
  
  {
  
  new:true
  
  }
  
  );
  
  res.json(updatedProduct);
  
  }catch(error){
  
  res.status(500).json({
  
  message:"Update failed."
  
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
// LOGIN ROUTE
// =========================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(400).json({
                message: "Invalid email or password."
            });

        }

        const passwordMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(400).json({
                message: "Invalid email or password."
            });

        }

        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            message: "Login successful",

            token,

            user: {

                id: user._id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server error"

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