 // ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

require("dotenv").config();


// ==========================================
// IMPORTS
// ==========================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// MODELS
// ==========================================

const User = require("./models/userModel");
const Product = require("./models/ProductModel");
const NewsletterSubscriber =
    require("./models/newsLetterModel");


// ==========================================
// EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://v-allary.github.io"
        ],

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],

        credentials: true
    })
);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(() => {

        console.log("MongoDB Connected");

    })

    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error
        );

    });


// ==========================================
// UPLOADS DIRECTORY
// ==========================================

const uploadsDirectory =
    path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDirectory)) {

    fs.mkdirSync(
        uploadsDirectory,
        {
            recursive: true
        }
    );

}


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                uploadsDirectory
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            const uniqueName =
                `${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}${path.extname(
                    file.originalname
                )}`;

            cb(
                null,
                uniqueName
            );

        }

    });


const upload =
    multer({

        storage,

        limits: {

            fileSize:
                10 * 1024 * 1024

        },

        fileFilter: (
            req,
            file,
            cb
        ) => {

            if (
                file.mimetype.startsWith(
                    "image/"
                )
            ) {

                cb(null, true);

            } else {

                cb(
                    new Error(
                        "Only image files are allowed."
                    )
                );

            }

        }

    });


// ==========================================
// SERVE UPLOADED IMAGES
// ==========================================

app.use(
    "/uploads",
    express.static(
        uploadsDirectory
    )
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).send(
            "House of KA API Running"
        );

    }
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "House of KA API is healthy"

        });

    }
);


// ==========================================
// SIGNUP
// ==========================================

app.post(
    "/signup",
    async (req, res) => {

        try {

            let {
                firstName,
                lastName,
                email,
                password
            } = req.body;

            firstName =
                firstName?.trim();

            lastName =
                lastName?.trim();

            email =
                email
                    ?.trim()
                    .toLowerCase();

            if (
                !firstName ||
                !lastName ||
                !email ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "All fields are required."

                    });

            }


            const existingUser =
                await User.findOne({
                    email
                });

            if (existingUser) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "User already exists."

                    });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            const newUser =
                new User({

                    firstName,

                    lastName,

                    email,

                    password:
                        hashedPassword

                });


            await newUser.save();


            const token =
                jwt.sign(

                    {
                        id:
                            newUser._id
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "7d"
                    }

                );


            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Account created successfully",

                    token,

                    user: {

                        id:
                            newUser._id,

                        firstName:
                            newUser.firstName,

                        lastName:
                            newUser.lastName,

                        email:
                            newUser.email

                    }

                });

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Server error"

                });

        }

    }
);


// ==========================================
// LOGIN
// ==========================================

app.post(
    "/login",
    async (req, res) => {

        try {

            let {
                email,
                password
            } = req.body;

            email =
                email
                    ?.trim()
                    .toLowerCase();


            if (
                !email ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Email and password are required."

                    });

            }


            const user =
                await User.findOne({
                    email
                });

            if (!user) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid email or password."

                    });

            }


            const passwordMatch =
                await bcrypt.compare(

                    password,

                    user.password

                );


            if (!passwordMatch) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid email or password."

                    });

            }


            const token =
                jwt.sign(

                    {
                        id:
                            user._id
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "7d"
                    }

                );


            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Login successful",

                    token,

                    user: {

                        id:
                            user._id,

                        firstName:
                            user.firstName,

                        lastName:
                            user.lastName,

                        email:
                            user.email

                    }

                });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Server error"

                });

        }

    }
);


// ==========================================
// CREATE PRODUCT
// ==========================================

app.post(
    "/products",

    upload.array(
        "images",
        10
    ),

    async (req, res) => {

        try {

            const {
                name,
                description,
                category,
                price,
                stock,
                sizes,
                colors,
                featured
            } = req.body;


            if (
                !name?.trim() ||
                price === undefined ||
                price === ""
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Product name and price are required."

                    });

            }


            const numericPrice =
                Number(price);

            const numericStock =
                Number(stock || 0);


            if (
                Number.isNaN(
                    numericPrice
                ) ||
                numericPrice < 0
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid product price."

                    });

            }


            if (
                Number.isNaN(
                    numericStock
                ) ||
                numericStock < 0
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid stock quantity."

                    });

            }


            let parsedSizes = [];
            let parsedColors = [];


            try {

                parsedSizes =
                    sizes
                        ? JSON.parse(
                            sizes
                        )
                        : [];

            } catch {

                parsedSizes = [];

            }


            try {

                parsedColors =
                    colors
                        ? JSON.parse(
                            colors
                        )
                        : [];

            } catch {

                parsedColors = [];

            }


            const images =
                (req.files || []).map(
                    file =>
                        `/uploads/${file.filename}`
                );


            const product =
                new Product({

                    name:
                        name.trim(),

                    description:
                        description
                            ?.trim() ||
                        "",

                    category:
                        category
                            ?.trim() ||
                        "",

                    price:
                        numericPrice,

                    stock:
                        numericStock,

                    images,

                    sizes:
                        Array.isArray(
                            parsedSizes
                        )
                            ? parsedSizes
                            : [],

                    colors:
                        Array.isArray(
                            parsedColors
                        )
                            ? parsedColors
                            : [],

                    featured:
                        featured ===
                        "true"

                });


            await product.save();


            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Product added successfully.",

                    product

                });

        } catch (error) {

            console.error(
                "Create product error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        error.message ||
                        "Failed to add product."

                });

        }

    }
);


// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get(
    "/products",
    async (req, res) => {

        try {

            const products =
                await Product
                    .find()
                    .sort({

                        createdAt: -1

                    });


            return res
                .status(200)
                .json(
                    products
                );

        } catch (error) {

            console.error(
                "Get products error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to load products."

                });

        }

    }
);


// ==========================================
// GET ONE PRODUCT
// ==========================================

app.get(
    "/products/:id",
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );


            if (!product) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Product not found."

                    });

            }


            return res
                .status(200)
                .json(
                    product
                );

        } catch (error) {

            console.error(
                "Get product error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to load product."

                });

        }

    }
);


// ==========================================
// UPDATE PRODUCT
// ==========================================

app.put(
    "/products/:id",
    async (req, res) => {

        try {

            const updateData = {
                ...req.body
            };


            if (
                updateData.price !==
                undefined
            ) {

                updateData.price =
                    Number(
                        updateData.price
                    );

            }


            if (
                updateData.stock !==
                undefined
            ) {

                updateData.stock =
                    Number(
                        updateData.stock
                    );

            }


            const updatedProduct =
                await Product
                    .findByIdAndUpdate(

                        req.params.id,

                        updateData,

                        {
                            new: true,

                            runValidators:
                                true
                        }

                    );


            if (!updatedProduct) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Product not found."

                    });

            }


            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Product updated successfully.",

                    product:
                        updatedProduct

                });

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Update failed."

                });

        }

    }
);


// ==========================================
// DELETE PRODUCT
// ==========================================

app.delete(
    "/products/:id",
    async (req, res) => {

        try {

            const product =
                await Product
                    .findByIdAndDelete(
                        req.params.id
                    );


            if (!product) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Product not found."

                    });

            }


            // Delete associated local image files.
            if (
                Array.isArray(
                    product.images
                )
            ) {

                product.images.forEach(
                    image => {

                        if (
                            typeof image !==
                            "string"
                        ) {

                            return;

                        }

                        if (
                            !image.startsWith(
                                "/uploads/"
                            )
                        ) {

                            return;

                        }

                        const filename =
                            path.basename(
                                image
                            );

                        const filePath =
                            path.join(
                                uploadsDirectory,
                                filename
                            );

                        if (
                            fs.existsSync(
                                filePath
                            )
                        ) {

                            try {

                                fs.unlinkSync(
                                    filePath
                                );

                            } catch (
                                fileError
                            ) {

                                console.error(
                                    "Image deletion error:",
                                    fileError
                                );

                            }

                        }

                    }
                );

            }


            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Product deleted successfully."

                });

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Delete failed."

                });

        }

    }
);


// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASS

        }

    });


// ==========================================
// CONTACT FORM
// ==========================================

app.post(
    "/submit-form",
    async (req, res) => {

        // Honeypot spam protection
        if (req.body.website) {

            return res
                .status(200)
                .json({

                    success: true

                });

        }


        const name =
            req.body.name?.trim();

        const email =
            req.body.email?.trim();

        const subject =
            req.body.subject?.trim();

        const message =
            req.body.message?.trim();


        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "All fields are required."

                });

        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                email
            )
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Please enter a valid email address."

                });

        }


        try {

            await transporter.sendMail({

                from:
                    `"House of KA Website" <${process.env.EMAIL_USER}>`,

                to:
                    "houseofk.a254@gmail.com",

                replyTo:
                    email,

                subject:
                    `Website Message: ${subject}`,

                html: `

                    <h3>
                        New Message from House of Kagendo Website
                    </h3>

                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>

                    <p>
                        <strong>Subject:</strong>
                        ${subject}
                    </p>

                    <p>
                        <strong>Message:</strong>
                    </p>

                    <p>
                        ${message.replace(
                            /\n/g,
                            "<br>"
                        )}
                    </p>

                `

            });


            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Message sent successfully."

                });

        } catch (error) {

            console.error(
                "Email send error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Failed to send message. Please try again later."

                });

        }

    }
);


// ==========================================
// NEWSLETTER SUBSCRIBE
// ==========================================

app.post(
    "/subscribe",
    async (req, res) => {

        try {

            const email =
                req.body.email
                    ?.trim()
                    .toLowerCase();


            if (!email) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Email is required."

                    });

            }


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(
                    email
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid email address."

                    });

            }


            const existingSubscriber =
                await NewsletterSubscriber
                    .findOne({
                        email
                    });


            if (
                existingSubscriber
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "You are already subscribed."

                    });

            }


            const subscriber =
                new NewsletterSubscriber({

                    email

                });


            await subscriber.save();


            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Welcome to House of Kagendo."

                });

        } catch (error) {

            console.error(
                "Newsletter error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Server error"

                });

        }

    }
);


// ==========================================
// GET NEWSLETTER SUBSCRIBERS
// ==========================================

app.get(
    "/newsletter",
    async (req, res) => {

        try {

            const subscribers =
                await NewsletterSubscriber
                    .find()
                    .sort({

                        createdAt: -1

                    });


            return res
                .status(200)
                .json(
                    subscribers
                );

        } catch (error) {

            console.error(
                "Get newsletter error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to load subscribers."

                });

        }

    }
);


// ==========================================
// DELETE NEWSLETTER SUBSCRIBER
// ==========================================

app.delete(
    "/newsletter/:id",
    async (req, res) => {

        try {

            const subscriber =
                await NewsletterSubscriber
                    .findByIdAndDelete(
                        req.params.id
                    );


            if (!subscriber) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Subscriber not found."

                    });

            }


            return res
                .status(200)
                .json({

                    success: true,

                    message:
                        "Subscriber removed successfully."

                });

        } catch (error) {

            console.error(
                "Delete subscriber error:",
                error
            );

            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to remove subscriber."

                });

        }

    }
);


// ==========================================
// 404 ROUTE
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found."

        });

    }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );


        if (
            error instanceof
            multer.MulterError
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        error.message

                });

        }


        return res
            .status(500)
            .json({

                success: false,

                message:
                    error.message ||
                    "Internal server error."

            });

    }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5050;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);