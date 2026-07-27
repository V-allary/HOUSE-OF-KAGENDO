require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./models/productModel");

const products = require("./products");

// ==============================
// CONNECT TO MONGODB
// ==============================

mongoose
.connect(process.env.MONGODB_URI)
.then(async () => {

    console.log("MongoDB Connected");

    let imported = 0;
    let skipped = 0;

    for (const product of products) {

        const exists = await Product.findOne({

            name: product.name,
            category: product.category,
            images: product.images[0]

        });

        if (exists) {

            skipped++;
            continue;

        }

        await Product.create({

            name: product.name,

            price: product.price,

            category: product.category,

            description: product.description,

            images: product.images,

            sizes: product.sizes,

            colors: product.colors,

            stock: 10,

            featured: false,

            bestseller:
                product.category === "BEST SELLERS",

            newArrival:
                product.category === "NEW ARRIVALS",

            sale: false,

            active: true

        });

        imported++;

        console.log(
            `✔ Imported ${product.name}`
        );

    }

    console.log("");
    console.log("========================");
    console.log(`Imported : ${imported}`);
    console.log(`Skipped  : ${skipped}`);
    console.log("========================");

    process.exit();

})
.catch(err => {

    console.error(err);

    process.exit(1);

});