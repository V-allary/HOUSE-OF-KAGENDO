 // =======================================
// HOUSE OF KAGENDO ADMIN
// =======================================

// Local development uses port 5050.
// Deployed website uses the Render backend.
const API_URL =
window.location.hostname === "127.0.0.1" ||
window.location.hostname === "localhost"
    ? "http://127.0.0.1:5050"
    : "https://house-of-kagendo.onrender.com";


// =======================================
// ADMIN LOGIN - SHOW / HIDE PASSWORD
// =======================================

const togglePassword =
document.getElementById("togglePassword");

const adminPasswordInput =
document.getElementById("adminPassword");

if (togglePassword && adminPasswordInput) {

togglePassword.addEventListener("click", () => {

    if (adminPasswordInput.type === "password") {

        adminPasswordInput.type = "text";

        togglePassword.classList.remove("bi-eye-slash");
        togglePassword.classList.add("bi-eye");

    } else {

        adminPasswordInput.type = "password";

        togglePassword.classList.remove("bi-eye");
        togglePassword.classList.add("bi-eye-slash");

    }

});

}


// =======================================
// ADMIN LOGIN
// =======================================

const loginForm =
document.getElementById("adminLoginForm");

if (loginForm) {

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value.trim();

    // Temporary admin login.
    // We will move this to secure backend authentication later.
    const adminEmail =
        "houseofka@gmail.com";

    const adminPassword =
        "HouseOfKa2026";

    if (
        email === adminEmail &&
        password === adminPassword
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
            "admin.html";

    } else {

        const loginError =
            document.getElementById("loginError");

        if (loginError) {

            loginError.innerText =
                "Invalid email or password.";

        }

    }

});

}


// =======================================
// ADMIN SECTIONS
// =======================================

const sections = {

dashboard:
    document.getElementById("dashboardSection"),

products:
    document.getElementById("productsSection"),

orders:
    document.getElementById("ordersSection"),

customers:
    document.getElementById("customersSection"),

newsletter:
    document.getElementById("newsletterSection"),

settings:
    document.getElementById("settingsSection")

};


// =======================================
// SIDEBAR MENU ITEMS
// =======================================

const menuItems = {

dashboard:
    document.getElementById("menuDashboard"),

products:
    document.getElementById("menuProducts"),

orders:
    document.getElementById("menuOrders"),

customers:
    document.getElementById("menuCustomers"),

newsletter:
    document.getElementById("menuNewsletter"),

settings:
    document.getElementById("menuSettings")

};


// =======================================
// SHOW ADMIN SECTION
// =======================================

function showSection(sectionName) {

Object.values(sections).forEach(section => {

    if (section) {

        section.style.display = "none";

    }

});

Object.values(menuItems).forEach(item => {

    if (item) {

        item.classList.remove("active");

    }

});

const selectedSection =
    sections[sectionName];

const selectedMenu =
    menuItems[sectionName];

if (selectedSection) {

    selectedSection.style.display = "block";

}

if (selectedMenu) {

    selectedMenu.classList.add("active");

}

}


// =======================================
// SIDEBAR NAVIGATION
// =======================================

if (menuItems.dashboard) {

menuItems.dashboard.addEventListener(
    "click",
    () => {

        showSection("dashboard");

        loadDashboard();

    }
);

}

if (menuItems.products) {

menuItems.products.addEventListener(
    "click",
    () => {

        showSection("products");

        loadProducts();

    }
);

}

if (menuItems.orders) {

menuItems.orders.addEventListener(
    "click",
    () => {

        showSection("orders");

        loadOrders();

    }
);

}

if (menuItems.customers) {

menuItems.customers.addEventListener(
    "click",
    () => {

        showSection("customers");

        loadCustomers();

    }
);

}

if (menuItems.newsletter) {

menuItems.newsletter.addEventListener(
    "click",
    () => {

        showSection("newsletter");

        loadNewsletter();

    }
);

}

if (menuItems.settings) {

menuItems.settings.addEventListener(
    "click",
    () => {

        showSection("settings");

    }
);

}


// =======================================
// QUICK ACTION BUTTONS
// =======================================

const quickAddProduct =
document.getElementById("quickAddProduct");

const quickViewOrders =
document.getElementById("quickViewOrders");

const quickViewCustomers =
document.getElementById("quickViewCustomers");

if (quickAddProduct) {

quickAddProduct.addEventListener(
    "click",
    () => {

        showSection("products");

        const formContainer =
            document.getElementById(
                "productFormContainer"
            );

        if (formContainer) {

            formContainer.style.display =
                "block";

        }

        const showButton =
            document.getElementById(
                "showProductForm"
            );

        if (showButton) {

            showButton.innerHTML = `
                <i class="bi bi-x-circle"></i>
                Close
            `;

        }

    }
);

}

if (quickViewOrders) {

quickViewOrders.addEventListener(
    "click",
    () => {

        showSection("orders");

        loadOrders();

    }
);

}

if (quickViewCustomers) {

quickViewCustomers.addEventListener(
    "click",
    () => {

        showSection("customers");

        loadCustomers();

    }
);

}


// =======================================
// LOGOUT
// =======================================

const adminLogout =
document.getElementById("adminLogout");

if (adminLogout) {

adminLogout.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure you want to log out?"
            );

        if (!confirmed) {

            return;

        }

        localStorage.removeItem(
            "adminLoggedIn"
        );

        window.location.href =
            "admin-login.html";

    }
);

}


// =======================================
// SHOW / HIDE PRODUCT FORM
// =======================================

const showProductForm =
document.getElementById("showProductForm");

const productFormContainer =
document.getElementById(
    "productFormContainer"
);

if (
showProductForm &&
productFormContainer
) {

showProductForm.addEventListener(
    "click",
    () => {

        const isHidden =
            productFormContainer.style.display ===
            "none";

        if (isHidden) {

            productFormContainer.style.display =
                "block";

            showProductForm.innerHTML = `
                <i class="bi bi-x-circle"></i>
                Close
            `;

        } else {

            productFormContainer.style.display =
                "none";

            showProductForm.innerHTML = `
                <i class="bi bi-plus-circle"></i>
                Add New Product
            `;

        }

    }
);

}


// =======================================
// GET CORRECT PRODUCT IMAGE URL
// =======================================

function getProductImage(product) {

if (
    !product.images ||
    product.images.length === 0
) {

    return "";

}

const image =
    product.images[0];

if (
    image.startsWith("http://") ||
    image.startsWith("https://")
) {

    return image;

}

return `${API_URL}${image}`;

}


// =======================================
// LOAD PRODUCTS FROM MONGODB
// =======================================

async function loadProducts() {

const table =
    document.getElementById(
        "productsTable"
    );

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

    const products =
        await response.json();

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );

    if (totalProducts) {

        totalProducts.innerText =
            products.length;

    }

    if (!table) {

        return products;

    }

    if (products.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                colspan="6"
                class="text-center">

                    No products have been added yet.
                    Click "Add New Product" to create
                    your first product.

                </td>

            </tr>

        `;

        return products;

    }

    table.innerHTML = "";

    products.forEach(product => {

        const imageURL =
            getProductImage(product);

        table.innerHTML += `

            <tr>

                <td>

                    ${
                        imageURL
                            ? `
                            <img
                            src="${imageURL}"
                            alt="${product.name}"
                            style="
                            width:70px;
                            height:80px;
                            object-fit:cover;
                            border-radius:8px;
                            ">
                            `
                            : `
                            <span>
                                No image
                            </span>
                            `
                    }

                </td>

                <td>
                    ${product.name || ""}
                </td>

                <td>
                    ${product.category || "-"}
                </td>

                <td>

                    KES ${Number(
                        product.price || 0
                    ).toLocaleString()}

                </td>

                <td>
                    ${product.stock ?? 0}
                </td>

                <td>

                    <button
                    type="button"
                    class="btn btn-sm btn-warning"
                    onclick="editProduct('${product._id}')">

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button
                    type="button"
                    class="btn btn-sm btn-danger ms-2"
                    onclick="deleteProduct('${product._id}')">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

    return products;

} catch (error) {

    console.error(
        "Load products error:",
        error
    );

    if (table) {

        table.innerHTML = `

            <tr>

                <td
                colspan="6"
                class="text-center text-danger">

                    Unable to load products.

                </td>

            </tr>

        `;

    }

    return [];

}

}

// =======================================
// PRODUCT EDIT MODE
// =======================================

let editingProductId = null;


// =======================================
// SAVE PRODUCT TO MONGODB
// =======================================

const productForm =
document.getElementById("productForm");

if (productForm) {

productForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const formData =
            new FormData();

        formData.append(
            "name",
            document
                .getElementById("productName")
                .value
                .trim()
        );

        formData.append(
            "price",
            document
                .getElementById("productPrice")
                .value
        );

        formData.append(
            "category",
            document
                .getElementById("productCategory")
                .value
                .trim()
        );

        formData.append(
            "description",
            document
                .getElementById("productDescription")
                .value
                .trim()
        );

        formData.append(
            "stock",
            document
                .getElementById("productStock")
                .value || 0
        );

        const sizes =
            document
                .getElementById("productSizes")
                .value
                .split(",")
                .map(size => size.trim())
                .filter(Boolean);

        const colors =
            document
                .getElementById("productColors")
                .value
                .split(",")
                .map(color => color.trim())
                .filter(Boolean);

        formData.append(
            "sizes",
            JSON.stringify(sizes)
        );

        formData.append(
            "colors",
            JSON.stringify(colors)
        );

        formData.append(
            "featured",
            "false"
        );

        const imageFiles =
            document.getElementById(
                "productImages"
            ).files;

        for (
            let i = 0;
            i < imageFiles.length;
            i++
        ) {

            formData.append(
                "images",
                imageFiles[i]
            );

        }

        try {
            let response;

            if (editingProductId) {
            
                // EDIT EXISTING PRODUCT
            
                const updateData = {
            
                    name:
                        document.getElementById("productName")
                            .value.trim(),
            
                    price:
                        Number(
                            document.getElementById("productPrice")
                                .value
                        ),
            
                    category:
                        document.getElementById("productCategory")
                            .value.trim(),
            
                    description:
                        document.getElementById("productDescription")
                            .value.trim(),
            
                    stock:
                        Number(
                            document.getElementById("productStock")
                                .value || 0
                        ),
            
                    sizes,
            
                    colors
            
                };
            
                response =
                    await fetch(
                        `${API_URL}/products/${editingProductId}`,
                        {
                            method: "PUT",
            
                            headers: {
                                "Content-Type": "application/json"
                            },
            
                            body:
                                JSON.stringify(updateData)
                        }
                    );
            
            } else {
            
                // ADD NEW PRODUCT
            
                response =
                    await fetch(
                        `${API_URL}/products`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );
            
            }
            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to save product."
                );

            }

            if (editingProductId) {

                alert(
                    "Product updated successfully!"
                );
            
            } else {
            
                alert(
                    "Product added successfully!"
                );
            
            }
            // Exit edit mode
editingProductId = null;

const submitButton =
    productForm.querySelector(
        'button[type="submit"]'
    );

submitButton.innerHTML = `
    <i class="bi bi-check-circle"></i>
    Save Product
`;

            productForm.reset();

            if (productFormContainer) {

                productFormContainer.style.display =
                    "none";

            }

            if (showProductForm) {

                showProductForm.innerHTML = `
                    <i class="bi bi-plus-circle"></i>
                    Add New Product
                `;

            }

            await loadProducts();

            await loadDashboard();

        } catch (error) {

            console.error(
                "Save product error:",
                error
            );

            alert(
                error.message ||
                "Unable to save product."
            );

        }

    }
);

}


// =======================================
// DELETE PRODUCT
// =======================================

async function deleteProduct(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `${API_URL}/products/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete product."
            );

        }

        alert("Product deleted successfully!");

        await loadProducts();

        await loadDashboard();

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete product."
        );

    }

}


// =======================================
// EDIT PRODUCT
// =======================================

async function editProduct(id) {

    try {

        const response =
            await fetch(`${API_URL}/products/${id}`);

        const product =
            await response.json();

        if (!response.ok) {

            throw new Error(
                product.message ||
                "Unable to load product."
            );

        }

        // Enter edit mode
        editingProductId = id;

        // Fill existing form with product data
        document.getElementById("productName").value =
            product.name || "";

        document.getElementById("productPrice").value =
            product.price || "";

        document.getElementById("productCategory").value =
            product.category || "";

        document.getElementById("productDescription").value =
            product.description || "";

        document.getElementById("productStock").value =
            product.stock ?? 0;

        document.getElementById("productSizes").value =
            Array.isArray(product.sizes)
                ? product.sizes.join(",")
                : "";

        document.getElementById("productColors").value =
            Array.isArray(product.colors)
                ? product.colors.join(",")
                : "";

        // Open form
        productFormContainer.style.display = "block";

        showProductForm.innerHTML = `
            <i class="bi bi-x-circle"></i>
            Cancel Edit
        `;

        // Change submit button wording
        const submitButton =
            productForm.querySelector(
                'button[type="submit"]'
            );

        submitButton.innerHTML = `
            <i class="bi bi-check-circle"></i>
            Update Product
        `;

        // Scroll to form
        productFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error(
            "Edit product error:",
            error
        );

        alert(
            error.message ||
            "Unable to load product."
        );

    }

}


// =======================================
// DASHBOARD STATISTICS
// =======================================

async function loadDashboard() {

try {

    const response =
        await fetch(
            `${API_URL}/products`
        );

    if (response.ok) {

        const products =
            await response.json();

        const totalProducts =
            document.getElementById(
                "totalProducts"
            );

        if (totalProducts) {

            totalProducts.innerText =
                products.length;

        }

    }

} catch (error) {

    console.error(
        "Dashboard product count error:",
        error
    );

}


/*
    Orders and customers do not yet have
    backend GET routes in your current
    server.js.

    Keep these at zero until those routes
    are built rather than showing fake
    localStorage data.
*/

const totalOrders =
    document.getElementById(
        "totalOrders"
    );

const totalCustomers =
    document.getElementById(
        "totalCustomers"
    );

const totalRevenue =
    document.getElementById(
        "totalRevenue"
    );

if (totalOrders) {

    totalOrders.innerText = "0";

}

if (totalCustomers) {

    totalCustomers.innerText = "0";

}

if (totalRevenue) {

    totalRevenue.innerText =
        "KES 0";

}

}


// =======================================
// ORDERS SECTION
// =======================================

function loadOrders() {

const table =
    document.getElementById(
        "ordersTable"
    );

if (!table) {

    return;

}

table.innerHTML = `

    <tr>

        <td
        colspan="8"
        class="text-center">

            No orders have been loaded yet.

        </td>

    </tr>

`;

}


// =======================================
// CUSTOMERS SECTION
// =======================================

function loadCustomers() {

const table =
    document.getElementById(
        "customersTable"
    );

if (!table) {

    return;

}

table.innerHTML = `

    <tr>

        <td
        colspan="5"
        class="text-center">

            No customers have been loaded yet.

        </td>

    </tr>

`;

}


// =======================================
// NEWSLETTER SECTION
// =======================================

function loadNewsletter() {

const table =
    document.getElementById(
        "newsletterTable"
    );

if (!table) {

    return;

}

table.innerHTML = `

    <tr>

        <td
        colspan="3"
        class="text-center">

            No newsletter subscribers
            have been loaded yet.

        </td>

    </tr>

`;

}


// =======================================
// SETTINGS FORM
// =======================================

const adminSettingsForm =
document.getElementById(
    "adminSettingsForm"
);

if (adminSettingsForm) {

adminSettingsForm.addEventListener(
    "submit",
    (e) => {

        e.preventDefault();

        alert(
            "Settings section is connected. Backend settings storage will be added next."
        );

    }
);

}


// =======================================
// INITIALIZE ADMIN DASHBOARD
// =======================================

async function initializeAdmin() {

if (!sections.dashboard) {

    return;

}

showSection("dashboard");

await loadDashboard();

}

initializeAdmin();