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
 
const fs = require("fs");


// ==========================================
// MODELS
// ==========================================

const User = require("./models/userModel");
const Product = require("./models/ProductModel");
const Order = require("./models/orderModel");
const Settings= require("./models/settingsModel");
const Admin= require("./models/adminModel");
const NewsletterSubscriber =
    require("./models/newsLetterModel");


 

// ==========================================
// EXPRESS APP
// ==========================================

const app = express();




// ==========================================
//  STATIC FILES
// ==========================================

app.use(express.static(__dirname));



    // ==========================================
// WEBSITE PAGES
// ==========================================

const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});


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

            "https://houseofkagendo.com",

            "https://www.houseofkagendo.com",

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
// VERIFY ADMIN MIDDLEWARE
// ==========================================

const verifyAdmin =
    (req, res, next) => {

        try {

            const authHeader =
                req.headers.authorization;

            if (
                !authHeader ||
                !authHeader.startsWith("Bearer ")
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Admin authentication required."

                });

            }

            const token =
                authHeader.split(" ")[1];

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            if (
                decoded.role !== "admin"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Admin access denied."

                });

            }

            req.admin =
                decoded;

            next();

        } catch (error) {

            return res.status(401).json({

                success: false,

                message:
                    "Admin session expired or invalid."

            });

        }

    };


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

                return res.status(400).json({

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

                return res.status(400).json({

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

            return res.status(201).json({

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

            return res.status(500).json({

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

                return res.status(400).json({

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

                return res.status(400).json({

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

                return res.status(400).json({

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

            return res.status(200).json({

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

            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post(
    "/admin/login",
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

            if (!email || !password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required."

                });

            }

            // Find admin and include password
            const admin =
                await Admin.findOne({
                    email
                });

            if (!admin) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid admin email or password."

                });

            }

            if (!admin.active) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This admin account is disabled."

                });

            }

            // Compare entered password
            // with hashed MongoDB password
            const passwordMatch =
                await bcrypt.compare(
                    password,
                    admin.password
                );

            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid admin email or password."

                });

            }

            // Create ADMIN-specific token
            const adminToken =
                jwt.sign(

                    {
                        id:
                            admin._id.toString(),

                        role:
                            "admin"

                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "8h"
                    }

                );

            return res.status(200).json({

                success: true,

                message:
                    "Admin login successful.",

                token:
                    adminToken,

                admin: {

                    id:
                        admin._id,

                    name:
                        admin.name,

                    email:
                        admin.email,

                    role:
                        admin.role

                }

            });

        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to log in."

            });

        }

    }
);


// ==========================================
// CREATE PRODUCT
// ==========================================

app.post(
    "/api/products",
    verifyAdmin,

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
                featured,
                bestseller,
                newArrival,
                sale
            } = req.body;

            if (
                !name?.trim() ||
                price === undefined ||
                price === ""
            ) {

                return res.status(400).json({

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

                return res.status(400).json({

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

                return res.status(400).json({

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
                        ? JSON.parse(sizes)
                        : [];

            } catch {

                parsedSizes = [];

            }

            try {

                parsedColors =
                    colors
                        ? JSON.parse(colors)
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
                        description?.trim() ||
                        "",

                    category:
                        category?.trim() ||
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
                            featured === "true",
                        
                        bestseller:
                            bestseller === "true",
                        
                        newArrival:
                            newArrival === "true",
                        
                        sale:
                            sale === "true"

                });

            await product.save();

            return res.status(201).json({

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

            return res.status(500).json({

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
    "/api/products",

    async (req, res) => {

        try {

            const products =
                await Product
                    .find()
                    .sort({

                        createdAt: -1

                    });

            return res.status(200).json(
                products
            );

        } catch (error) {

            console.error(
                "Get products error:",
                error
            );

            return res.status(500).json({

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
    "/api/products/:id",
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }

            return res.status(200).json(
                product
            );

        } catch (error) {

            console.error(
                "Get product error:",
                error
            );

            return res.status(500).json({

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
    "/api/products/:id",
    verifyAdmin,

    upload.array(
        "images",
        10
    ),

    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }

            if (
                req.body.name !==
                undefined
            ) {

                product.name =
                    req.body.name.trim();

            }

            if (
                req.body.price !==
                undefined
            ) {

                const price =
                    Number(
                        req.body.price
                    );

                if (
                    Number.isNaN(price) ||
                    price < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Please enter a valid product price."

                    });

                }

                product.price =
                    price;

            }

            if (
                req.body.category !==
                undefined
            ) {

                product.category =
                    req.body.category.trim();

            }

            if (
                req.body.description !==
                undefined
            ) {

                product.description =
                    req.body.description.trim();

            }

            if (
                req.body.stock !==
                undefined
            ) {

                const stock =
                    Number(
                        req.body.stock
                    );

                if (
                    Number.isNaN(stock) ||
                    stock < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Please enter a valid stock quantity."

                    });

                }

                product.stock =
                    stock;

            }

            if (
                req.body.sizes !==
                undefined
            ) {

                try {

                    const sizes =
                        JSON.parse(
                            req.body.sizes
                        );

                    product.sizes =
                        Array.isArray(sizes)
                            ? sizes
                            : [];

                } catch {

                    product.sizes = [];

                }

            }

            if (
                req.body.colors !==
                undefined
            ) {

                try {

                    const colors =
                        JSON.parse(
                            req.body.colors
                        );

                    product.colors =
                        Array.isArray(colors)
                            ? colors
                            : [];

                } catch {

                    product.colors = [];

                }

            }

            if (req.body.featured !== undefined) {

                product.featured =
                    req.body.featured === "true";
            
            }
            
            if (req.body.bestseller !== undefined) {
            
                product.bestseller =
                    req.body.bestseller === "true";
            
            }
            
            if (req.body.newArrival !== undefined) {
            
                product.newArrival =
                    req.body.newArrival === "true";
            
            }
            
            if (req.body.sale !== undefined) {
            
                product.sale =
                    req.body.sale === "true";
            
            }

            // Replace images only if new images were uploaded.
            if (
                req.files &&
                req.files.length > 0
            ) {

                if (
                    Array.isArray(
                        product.images
                    )
                ) {

                    product.images.forEach(
                        image => {

                            if (
                                typeof image ===
                                "string" &&
                                image.startsWith(
                                    "/uploads/"
                                )
                            ) {

                                const oldFile =
                                    path.join(

                                        uploadsDirectory,

                                        path.basename(
                                            image
                                        )

                                    );

                                if (
                                    fs.existsSync(
                                        oldFile
                                    )
                                ) {

                                    try {

                                        fs.unlinkSync(
                                            oldFile
                                        );

                                    } catch (
                                        fileError
                                    ) {

                                        console.error(
                                            "Old image deletion error:",
                                            fileError
                                        );

                                    }

                                }

                            }

                        }
                    );

                }

                product.images =
                    req.files.map(
                        file =>
                            `/uploads/${file.filename}`
                    );

            }

            await product.save();

            return res.status(200).json({

                success: true,

                message:
                    "Product updated successfully.",

                product

            });

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to update product."

            });

        }

    }
);


// ==========================================
// DELETE PRODUCT
// ==========================================

app.delete(
    "/api/products/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const product =
                await Product
                    .findByIdAndDelete(
                        req.params.id
                    );

            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found."

                });

            }

            if (
                Array.isArray(
                    product.images
                )
            ) {

                product.images.forEach(
                    image => {

                        if (
                            typeof image !==
                            "string" ||
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

            return res.status(200).json({

                success: true,

                message:
                    "Product deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Delete failed."

            });

        }

    }
);


// ==========================================
// CREATE ORDER
// ==========================================

app.post(
    "/orders",
    
    async (req, res) => {

        try {

            const {
                customer,
                items,
                deliveryFee,
                deliveryAddress,
                paymentMethod
            } = req.body;

            if (
                !customer ||
                !customer.firstName ||
                !customer.email ||
                !customer.phone
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Customer information is incomplete."

                });

            }

            if (
                !Array.isArray(items) ||
                items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order must contain at least one product."

                });

            }

            let subtotal = 0;

            const orderItems = [];
            for (const item of items) {

                console.log("Incoming itme:",item);

                const productId = item.productId || item.id;

                console.log("Resolved productId:", productId);
            
                if (!productId) {
            
                    return res.status(400).json({
            
                        success: false,
            
                        message: "A product ID is missing from the order."
            
                    });
            
                }
            
                const product = await Product.findById(productId);
            
                if (!product) {
            
                    return res.status(404).json({
            
                        success: false,
            
                        message: `Product not found: ${productId}`
            
                    });
            
                }
            
                const quantity =
            
                    Math.max(
            
                        1,
            
                        Number(item.quantity) || 1
                    );
                if (
                    product.stock <
                    quantity
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Not enough stock for ${product.name}.`

                    });

                }

                subtotal +=
                    Number(
                        product.price
                    ) *
                    quantity;

                orderItems.push({

                    productId:
                        product._id,

                    name:
                        product.name,

                    price:
                        product.price,

                    quantity,

                    size:
                        item.size || "",

                    color:
                        item.color || "",

                    image:
                        product.images?.[0] ||
                        ""

                });

            }

            const safeDeliveryFee =
                Math.max(
                    0,
                    Number(
                        deliveryFee
                    ) || 0
                );

            const total =
                subtotal +
                safeDeliveryFee;

            const orderNumber =
                `HOK-${Date.now()}-${Math.floor(
                    1000 +
                    Math.random() * 9000
                )}`;

            const order =
                new Order({

                    orderNumber,

                    customer: {

                        firstName:
                            customer.firstName
                                .trim(),

                        lastName:
                            customer.lastName
                                ?.trim() ||
                            "",

                        email:
                            customer.email
                                .trim()
                                .toLowerCase(),

                        phone:
                            customer.phone
                                .trim()

                    },

                    items:
                        orderItems,

                    subtotal,

                    deliveryFee:
                        safeDeliveryFee,

                    total,

                    deliveryAddress: {

                        address:
                            deliveryAddress
                                ?.address ||
                            "",

                        city:
                            deliveryAddress
                                ?.city ||
                            "",

                        county:
                            deliveryAddress
                                ?.county ||
                            ""

                    },

                    paymentMethod:
                        paymentMethod ||
                        "",

                    paymentStatus:
                        "Pending",

                    orderStatus:
                        "Pending"

                });

            await order.save();

            // Stock is deliberately NOT reduced here.
            // It will be reduced only after successful
            // payment verification.

            return res.status(201).json({

                success: true,

                message:
                    "Order created successfully.",

                order

            });

        } catch (error) {

            console.error(
                "Create order error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to create order."

            });

        }

    }
);


// ==========================================
// GET ALL ORDERS
// ==========================================

app.get(
    "/orders",
    verifyAdmin,
    async (req, res) => {

        try {

            const orders =
                await Order
                    .find()
                    .sort({

                        createdAt: -1

                    });

            return res.status(200).json(
                orders
            );

        } catch (error) {

            console.error(
                "Get orders error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load orders."

            });

        }

    }
);


// ==========================================
// GET ONE ORDER
// ==========================================

app.get(
    "/orders/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.id
                );

            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }

            return res.status(200).json(
                order
            );

        } catch (error) {

            console.error(
                "Get order error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load order."

            });

        }

    }
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

app.put(
    "/orders/:id/status",
    async (req, res) => {

        try {

            const {
                orderStatus,
                paymentStatus
            } = req.body;

            const allowedOrderStatuses = [

                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"

            ];

            const allowedPaymentStatuses = [

                "Pending",
                "Paid",
                "Failed",
                "Refunded"

            ];

            const updateData = {};

            if (orderStatus) {

                if (
                    !allowedOrderStatuses.includes(
                        orderStatus
                    )
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Invalid order status."

                    });

                }

                updateData.orderStatus =
                    orderStatus;

            }

            if (paymentStatus) {

                if (
                    !allowedPaymentStatuses.includes(
                        paymentStatus
                    )
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Invalid payment status."

                    });

                }

                updateData.paymentStatus =
                    paymentStatus;

            }

            const order =
                await Order.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                );

            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }

            return res.status(200).json({

                success: true,

                message:
                    "Order updated successfully.",

                order

            });

        } catch (error) {

            console.error(
                "Update order error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update order."

            });

        }

    }
);


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

app.get(
    "/admin/stats",
    verifyAdmin,
    async (req, res) => {

        try {

            const [
                totalProducts,
                totalOrders,
                totalCustomers,
                revenueResult
            ] =
                await Promise.all([

                    Product.countDocuments(),

                    Order.countDocuments(),

                    User.countDocuments(),

                    Order.aggregate([

                        {
                            $match: {

                                paymentStatus:
                                    "Paid"

                            }
                        },

                        {
                            $group: {

                                _id: null,

                                total: {

                                    $sum:
                                        "$total"

                                }

                            }
                        }

                    ])

                ]);

            const totalRevenue =
                revenueResult.length > 0
                    ? revenueResult[0].total
                    : 0;

            return res.status(200).json({

                totalProducts,

                totalOrders,

                totalCustomers,

                totalRevenue

            });

        } catch (error) {

            console.error(
                "Dashboard statistics error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load dashboard statistics."

            });

        }

    }
);


// ==========================================
// CUSTOMERS - GET ALL
// ==========================================

app.get(
    "/customers",
    verifyAdmin,
    async (req, res) => {

        try {

            const customers =
                await User.find(
                    {},
                    {
                        password: 0,
                        __v: 0
                    }
                )
                    .sort({

                        createdAt: -1

                    });

            return res.status(200).json(
                customers
            );

        } catch (error) {

            console.error(
                "Get customers error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load customers."

            });

        }

    }
);


// ==========================================
// CUSTOMER DETAILS + ORDERS
// ==========================================

app.get(
    "/customers/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const customer =
                await User.findById(
                    req.params.id
                )
                    .select(
                        "-password -__v"
                    );

            if (!customer) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Customer not found."

                });

            }

            const orders =
                await Order.find({

                    "customer.email":
                        customer.email
                            .toLowerCase()

                })
                    .sort({

                        createdAt: -1

                    });

            const totalSpent =
                orders

                    .filter(
                        order =>
                            order.paymentStatus ===
                            "Paid"
                    )

                    .reduce(
                        (
                            total,
                            order
                        ) =>
                            total +
                            Number(
                                order.total ||
                                0
                            ),
                        0
                    );

            return res.status(200).json({

                success: true,

                customer,

                orders,

                statistics: {

                    totalOrders:
                        orders.length,

                    totalSpent

                }

            });

        } catch (error) {

            console.error(
                "Get customer error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load customer."

            });

        }

    }
);


// ==========================================
// INITIALIZE PAYSTACK PAYMENT
// ==========================================

app.post(
    "/payments/paystack/initialize",
    async (req, res) => {

        try {

            const {
                orderId
            } = req.body;

            if (
                !process.env
                    .PAYSTACK_SECRET_KEY
            ) {

                return res.status(503).json({

                    success: false,

                    message:
                        "Paystack has not been configured yet."

                });

            }

            const order =
                await Order.findById(
                    orderId
                );

            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }

            if (
                order.paymentStatus ===
                "Paid"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This order has already been paid."

                });

            }

            const amount =
                Math.round(
                    Number(
                        order.total
                    ) * 100
                );

            const reference =
                `HOK-${order._id}-${Date.now()}`;

            const paymentRequest = {

                email:
                    order.customer.email,

                amount:
                    amount.toString(),

                currency:
                    "KES",

                reference,

                metadata:
                    JSON.stringify({

                        orderId:
                            order._id
                                .toString(),

                        orderNumber:
                            order.orderNumber

                    })

            };

            // Add callback URL when configured.
            if (
                process.env
                    .PAYSTACK_CALLBACK_URL
            ) {

                paymentRequest.callback_url =
                    process.env
                        .PAYSTACK_CALLBACK_URL;

            }

            const paystackResponse =
                await fetch(

                    "https://api.paystack.co/transaction/initialize",

                    {

                        method:
                            "POST",

                        headers: {

                            Authorization:
                                `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                paymentRequest
                            )

                    }

                );

            const paymentData =
                await paystackResponse.json();

            if (
                !paystackResponse.ok ||
                !paymentData.status
            ) {

                console.error(
                    "Paystack initialization:",
                    paymentData
                );

                return res.status(400).json({

                    success: false,

                    message:
                        paymentData.message ||
                        "Unable to initialize payment."

                });

            }

            return res.status(200).json({

                success: true,

                authorizationUrl:
                    paymentData.data
                        .authorization_url,

                accessCode:
                    paymentData.data
                        .access_code,

                reference:
                    paymentData.data
                        .reference

            });

        } catch (error) {

            console.error(
                "Paystack initialization error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to initialize payment."

            });

        }

    }
);


// ==========================================
// VERIFY PAYSTACK PAYMENT
// ==========================================

app.get(
    "/payments/paystack/verify/:reference",
    async (req, res) => {

        try {

            if (
                !process.env
                    .PAYSTACK_SECRET_KEY
            ) {

                return res.status(503).json({

                    success: false,

                    message:
                        "Paystack has not been configured yet."

                });

            }

            const reference =
                req.params.reference;

            const paystackResponse =
                await fetch(

                    `https://api.paystack.co/transaction/verify/${encodeURIComponent(
                        reference
                    )}`,

                    {

                        method:
                            "GET",

                        headers: {

                            Authorization:
                                `Bearer ${process.env.PAYSTACK_SECRET_KEY}`

                        }

                    }

                );

            const paymentData =
                await paystackResponse.json();

            if (
                !paystackResponse.ok ||
                !paymentData.status
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        paymentData.message ||
                        "Payment verification failed."

                });

            }

            const transaction =
                paymentData.data;

            let metadata =
                transaction.metadata ||
                {};

            if (
                typeof metadata ===
                "string"
            ) {

                try {

                    metadata =
                        JSON.parse(
                            metadata
                        );

                } catch {

                    metadata = {};

                }

            }

            const orderId =
                metadata.orderId;

            if (!orderId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Order information is missing from payment."

                });

            }

            const order =
                await Order.findById(
                    orderId
                );

            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found."

                });

            }

            const expectedAmount =
                Math.round(
                    Number(
                        order.total
                    ) * 100
                );

            if (
                transaction.status !==
                "success"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment has not been completed.",

                    paymentStatus:
                        transaction.status

                });

            }

            if (
                Number(
                    transaction.amount
                ) !==
                expectedAmount
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment amount does not match order total."

                });

            }

            if (
                transaction.currency !==
                "KES"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment currency does not match."

                });

            }

            // ==========================================
            // MARK PAID + REDUCE STOCK ONCE
            // ==========================================

            if (
                order.paymentStatus !==
                "Paid"
            ) {

                // Check every product before
                // changing any stock.
                for (
                    const item
                    of order.items
                ) {

                    const product =
                        await Product.findById(
                            item.productId
                        );

                    if (!product) {

                        return res.status(404).json({

                            success: false,

                            message:
                                `Product no longer exists: ${item.name}`

                        });

                    }

                    if (
                        product.stock <
                        item.quantity
                    ) {

                        return res.status(400).json({

                            success: false,

                            message:
                                `${item.name} no longer has enough stock.`

                        });

                    }

                }

                // Reduce inventory only after
                // successful verification.
                for (
                    const item
                    of order.items
                ) {

                    await Product.findByIdAndUpdate(

                        item.productId,

                        {

                            $inc: {

                                stock:
                                    -item.quantity

                            }

                        }

                    );

                }

                order.paymentStatus =
                    "Paid";

                order.orderStatus =
                    "Confirmed";

                await order.save();

            }

            return res.status(200).json({

                success: true,

                message:
                    "Payment verified successfully.",

                order

            });

        } catch (error) {

            console.error(
                "Paystack verification error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to verify payment."

            });

        }

    }
);


// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter =
    nodemailer.createTransport({

        service:
            "gmail",

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

        if (
            req.body.website
        ) {

            return res.status(200).json({

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

            return res.status(400).json({

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

            return res.status(400).json({

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

            res.status(200).json({

                success: true,

                message:
                    "Message sent successfully."

            });

        } catch (error) {

            console.error(
                "Email send error:",
                error
            );

            res.status(500).json({

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

                return res.status(400).json({

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

                return res.status(400).json({

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

                return res.status(400).json({

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

            return res.status(201).json({

                success: true,

                message:
                    "Welcome to House of Kagendo."

            });

        } catch (error) {

            console.error(
                "Newsletter error:",
                error
            );

            return res.status(500).json({

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
    verifyAdmin,
    async (req, res) => {

        try {

            const subscribers =
                await NewsletterSubscriber
                    .find()
                    .sort({

                        createdAt: -1

                    });

            return res.status(200).json(
                subscribers
            );

        } catch (error) {

            console.error(
                "Get newsletter error:",
                error
            );

            return res.status(500).json({

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
    verifyAdmin,
    async (req, res) => {

        try {

            const subscriber =
                await NewsletterSubscriber
                    .findByIdAndDelete(
                        req.params.id
                    );

            if (!subscriber) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Subscriber not found."

                });

            }

            return res.status(200).json({

                success: true,

                message:
                    "Subscriber removed successfully."

            });

        } catch (error) {

            console.error(
                "Delete subscriber error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to remove subscriber."

            });

        }

    }
);

// ==========================================
// GET STORE SETTINGS
// ==========================================

app.get(
    "/settings",
    verifyAdmin,
    async (req, res) => {

        try {

            let settings =
                await Settings.findOne();

            if (!settings) {

                settings =
                    await Settings.create({

                        storeName:
                            "House of Kagendo",

                        storeEmail:
                            ""

                    });

            }

            return res.status(200).json(
                settings
            );

        } catch (error) {

            console.error(
                "Get settings error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to load settings."

            });

        }

    }
);


// ==========================================
// UPDATE STORE SETTINGS
// ==========================================

app.put(
    "/settings",
    verifyAdmin,
    async (req, res) => {

        try {

            const {
                storeName,
                storeEmail
            } = req.body;

            if (!storeName?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Store name is required."

                });

            }

            let settings =
                await Settings.findOne();

            if (!settings) {

                settings =
                    new Settings();

            }

            settings.storeName =
                storeName.trim();

            settings.storeEmail =
                storeEmail?.trim() || "";

            await settings.save();

            return res.status(200).json({

                success: true,

                message:
                    "Settings saved successfully.",

                settings

            });

        } catch (error) {

            console.error(
                "Update settings error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to save settings."

            });

        }

    }
);

// ==========================================
// 404 ROUTE
// KEEP AFTER ALL REAL ROUTES
// ==========================================

app.use(
    (req, res) => {

        return res.status(404).json({

            success: false,

            message:
                "Route not found."

        });

    }
);



// ==========================================
// GLOBAL ERROR HANDLER
// KEEP AFTER THE 404 HANDLER
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

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }

        return res.status(500).json({

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
    process.env.PORT ||
    5050;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);