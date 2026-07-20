 // ==========================================
// HOUSE OF KAGENDO API
// ==========================================
 
const API_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
        ? "http://127.0.0.1:5050/api"
        : window.location.origin + "/api";
// ==========================================
// GET ALL PRODUCTS
// ==========================================

async function getProducts() {

try {

    const response =
        await fetch(
            `${API_URL}/products`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load products."
        );

    }

    return await response.json();

} catch (error) {

    console.error(
        "Products API Error:",
        error
    );

    return [];

}

}


// ==========================================
// GET ONE PRODUCT
// ==========================================

async function getProduct(id) {

try {

    const response =
        await fetch(
            `${API_URL}/products/${id}`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load product."
        );

    }

    return await response.json();

} catch (error) {

    console.error(
        "Product API Error:",
        error
    );

    return null;

}

}

 // ==========================================
// GET IMAGE URL
// ==========================================
function getImageURL(image) {
 
    if (!image) return "";

    if (image.startsWith("/uploads")) {

        return `${window.location.origin}${image}`;

    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }

    return image;

}