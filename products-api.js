 // ==========================================
// HOUSE OF KAGENDO API
// ==========================================

const SERVER_URL =
window.location.hostname === "127.0.0.1" ||
window.location.hostname === "localhost"
    ? "http://127.0.0.1:5050"
    : "https://house-of-kagendo.onrender.com";

const API_URL = SERVER_URL + "/api";

// How long to wait for the server before using the backup list
const SERVER_TIMEOUT = 5000; // 5 seconds


// ==========================================
// BACKUP PRODUCTS (from products-data.js)
// ==========================================

function getBackupProducts() {

if (typeof STATIC_PRODUCTS === "undefined") {

    console.warn(
        "products-data.js is not loaded, so there are no backup products."
    );

    return [];

}

return STATIC_PRODUCTS;

}


// ==========================================
// FETCH WITH A TIME LIMIT
// ==========================================

async function fetchWithTimeout(url) {

const controller = new AbortController();

const timer = setTimeout(
    () => controller.abort(),
    SERVER_TIMEOUT
);

try {

    return await fetch(url, {
        signal: controller.signal
    });

} finally {

    clearTimeout(timer);

}

}


// ==========================================
// GET ALL PRODUCTS
// ==========================================

async function getProducts() {

try {

    const response =
        await fetchWithTimeout(
            `${API_URL}/products`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load products."
        );

    }

    const products =
        await response.json();

    if (!Array.isArray(products) || products.length === 0) {

        throw new Error(
            "Server returned no products."
        );

    }

    return products;

} catch (error) {

    console.warn(
        "Server not available, showing backup products.",
        error
    );

    return getBackupProducts();

}

}


// ==========================================
// GET ONE PRODUCT
// ==========================================

async function getProduct(id) {

try {

    const response =
        await fetchWithTimeout(
            `${API_URL}/products/${id}`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load product."
        );

    }

    return await response.json();

} catch (error) {

    console.warn(
        "Server not available, using backup product.",
        error
    );

    return getBackupProducts().find(
        product => product._id === id
    ) || null;

}

}


// ==========================================
// GET IMAGE URL
// ==========================================

function getImageURL(image) {

if (!image) return "";

if (image.startsWith("/uploads")) {

    return `${SERVER_URL}${image}`;

}

return image;

}
