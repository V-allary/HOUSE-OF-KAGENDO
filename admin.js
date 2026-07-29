 // =======================================
// HOUSE OF KAGENDO ADMIN
// =======================================

// Local development uses port 5050.
// Deployed website uses the Render backend.
const API_URL = "";
    


// =======================================
// PROTECT ADMIN DASHBOARD
// =======================================

const adminToken =
    localStorage.getItem(
        "adminToken"
    );

if (

    !adminToken &&

    window.location.pathname.endsWith(
        "/dashboard.html"
    )

) {

    window.location.href =
        "/admin.html";

}
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
// SECURE ADMIN LOGIN
// =======================================

const loginForm =
document.getElementById(
    "adminLoginForm"
);

if (loginForm) {

loginForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const email =
            document
                .getElementById(
                    "adminEmail"
                )
                .value
                .trim();

        const password =
            document
                .getElementById(
                    "adminPassword"
                )
                .value;

        const loginError =
            document.getElementById(
                "loginError"
            );

        if (loginError) {

            loginError.innerText =
                "Signing in...";

        }

        try {

            const response =
                await fetch(
                    `${API_URL}/admin/login`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email,
                                password

                            })

                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(

                    data.message ||
                    "Invalid email or password."

                );

            }

            // Remove old temporary login flag
            localStorage.removeItem(
                "adminLoggedIn"
            );

            // Save secure admin session
            localStorage.setItem(
                "adminToken",
                data.token
            );

            localStorage.setItem(
                "adminUser",
                JSON.stringify(
                    data.admin
                )
            );

            window.location.href =
                "/dashboard";

        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            if (loginError) {

                loginError.innerText =
                    error.message ||
                    "Unable to log in.";

            }

        }

    }
);

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
// ADMIN LOGOUT
// =======================================

const adminLogout =
    document.getElementById("adminLogout");

if (adminLogout) {

    adminLogout.style.cursor = "pointer";

    adminLogout.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "adminLoggedIn"
            );
            
            localStorage.removeItem(
                "adminToken"
            );
            
            localStorage.removeItem(
                "adminUser"
            );
            
            window.location.href =
                "/admin";

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

    // Uploaded images
    if (image.startsWith("/uploads")) {

        return `${API_URL}${image}`;

    }

    // External images
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }

    // Images inside your project
    return image;

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
                `${API_URL}/api/products`
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
            const formData = new FormData();

            const name =
                document.getElementById("productName")
                .value.trim();
            
            const price =
                Number(
                    document.getElementById("productPrice").value
                );
            
            const category =
                document.getElementById("productCategory")
                .value.trim();
            
            const description =
                document.getElementById("productDescription")
                .value.trim();
            
            const stock =
                Number(
                    document.getElementById("productStock").value
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
            
            const imageFiles =
                document.getElementById("productImages").files;
            
            
            // =======================================
            // VALIDATE PRODUCT
            // =======================================
   
function showAdminAlert(message, type = "warning") {

    let alertBox =
        document.getElementById("adminAlert");

    if (!alertBox) {

        alertBox =
            document.createElement("div");

        alertBox.id = "adminAlert";

        document
            .querySelector(".admin-main")
            .prepend(alertBox);

    }

    let icon = "bi-exclamation-triangle";

    if (type === "success") {

        icon = "bi-check-circle-fill";

    } else if (type === "error") {

        icon = "bi-x-circle-fill";

    }

    alertBox.innerHTML = `
        <div class="admin-alert ${type}">
            <i class="bi ${icon}"></i>
            <span>${message}</span>
        </div>
    `;

    setTimeout(() => {

        alertBox.innerHTML = "";

    }, 3500);

}
            
            // =======================================
            // BUILD FORMDATA
            // =======================================
            
            formData.append("name", name);
            
            formData.append("price", price);
            
            formData.append("category", category);
            
            formData.append("description", description);
            
            formData.append("stock", stock);
            
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
                document.getElementById("productFeatured").checked
            );
            
            formData.append(
                "bestseller",
                document.getElementById("productBestSeller").checked
            );
            
            formData.append(
                "newArrival",
                document.getElementById("productNewArrival").checked
            );
            
            formData.append(
                "sale",
                document.getElementById("productSale").checked
            );
            
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

    // =======================================
    // UPDATE EXISTING PRODUCT
    // =======================================
    response = await fetch(
        `${API_URL}/api/products/${editingProductId}`,
        {
            method: "PUT",
    
            headers: {
    
                Authorization:
                    `Bearer ${localStorage.getItem("adminToken")}`
    
            },
    
            body: formData
        }
    );

} else {

    // =======================================
    // ADD NEW PRODUCT
    // =======================================
    response = await fetch(
        `${API_URL}/api/products`,
        {
            method: "POST",
    
            headers: {
    
                Authorization:
                    `Bearer ${localStorage.getItem("adminToken")}`
    
            },
    
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

                    showAdminAlert(
                        "✔ Product updated successfully!",
                        "success"
                    );
                
                } else {
                
                    showAdminAlert(
                        "✔ Product added successfully!",
                        "success"
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
                showAdminAlert(
                    error.message ||
                    "Unable to save product.",
                    "error"
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

        const response =
            await fetch(
                `${API_URL}/api/products/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem("adminToken")}`

                    }

                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(

                data.message ||

                "Unable to delete product."

            );

        }
        await loadProducts();
await loadDashboard();

showAdminAlert(
    "✔ Product deleted successfully!",
    "success"
);
    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        showAdminAlert(

            error.message ||
        
            "Unable to delete product.",
        
            "error"
        
        );

    }

}

// =======================================
// EDIT PRODUCT
// =======================================

async function editProduct(id) {

    try {

        const response =
            await fetch(`${API_URL}/api/products/${id}`);

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
        showAdminAlert(
            error.message ||
            "Unable to load product.",
            "error"
        );

    }

}
 // =======================================
// DASHBOARD STATISTICS
// =======================================

async function loadDashboard() {

    try {

        const adminToken =
            localStorage.getItem(
                "adminToken"
            );

        const response =
            await fetch(
                `${API_URL}/admin/stats`,
                {
                    headers: {

                        Authorization:
                            `Bearer ${adminToken}`

                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load dashboard statistics."
            );

        }


        // =======================================
        // PRODUCTS
        // =======================================

        const totalProducts =
            document.getElementById(
                "totalProducts"
            );

        if (totalProducts) {

            totalProducts.innerText =
                data.totalProducts || 0;

        }


        // =======================================
        // ORDERS
        // =======================================

        const totalOrders =
            document.getElementById(
                "totalOrders"
            );

        if (totalOrders) {

            totalOrders.innerText =
                data.totalOrders || 0;

        }


        // =======================================
        // CUSTOMERS
        // =======================================

        const totalCustomers =
            document.getElementById(
                "totalCustomers"
            );

        if (totalCustomers) {

            totalCustomers.innerText =
                data.totalCustomers || 0;

        }


        // =======================================
        // REVENUE
        // =======================================

        const totalRevenue =
            document.getElementById(
                "totalRevenue"
            );

        if (totalRevenue) {

            totalRevenue.innerText =
                "KES " +
                Number(
                    data.totalRevenue || 0
                ).toLocaleString();

        }

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );

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

// =======================================
// ORDERS MANAGEMENT
// =======================================

let allOrders = [];


// =======================================
// LOAD ORDERS
// =======================================

async function loadOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );

    if (!table) return;


    try {
        const response =
        await fetch(
            `${API_URL}/orders`,
            {
                headers: {
    
                    Authorization:
                        `Bearer ${localStorage.getItem("adminToken")}`
    
                }
            }
        );

        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load orders."
            );

        }


        allOrders =
            Array.isArray(data)
                ? data
                : [];


        updateOrderStatistics(
            allOrders
        );


        renderOrders(
            allOrders
        );


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-danger"
                >

                    Unable to load orders.

                </td>

            </tr>

        `;

    }

}


// =======================================
// ORDER STATISTICS
// =======================================

function updateOrderStatistics(
    orders
) {

    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                order.orderStatus ===
                "Pending"
        ).length;


    const shipped =
        orders.filter(
            order =>
                order.orderStatus ===
                "Shipped"
        ).length;


    const delivered =
        orders.filter(
            order =>
                order.orderStatus ===
                "Delivered"
        ).length;


    const totalElement =
        document.getElementById(
            "ordersCount"
        );

    const pendingElement =
        document.getElementById(
            "pendingOrdersCount"
        );

    const shippedElement =
        document.getElementById(
            "shippedOrdersCount"
        );

    const deliveredElement =
        document.getElementById(
            "deliveredOrdersCount"
        );


    if (totalElement) {

        totalElement.innerText =
            total;

    }


    if (pendingElement) {

        pendingElement.innerText =
            pending;

    }


    if (shippedElement) {

        shippedElement.innerText =
            shipped;

    }


    if (deliveredElement) {

        deliveredElement.innerText =
            delivered;

    }

}


// =======================================
// RENDER ORDERS
// =======================================

function renderOrders(
    orders
) {

    const table =
        document.getElementById(
            "ordersTable"
        );


    if (!table) return;


    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center"
                >

                    No orders have been placed yet.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    orders.forEach(
        order => {

            const date =
                new Date(
                    order.createdAt
                )
                .toLocaleDateString(
                    "en-KE",
                    {

                        year:
                            "numeric",

                        month:
                            "short",

                        day:
                            "numeric"

                    }
                );


            const customerName =
                `${order.customer?.firstName || ""}
                 ${order.customer?.lastName || ""}`
                    .trim();


            table.innerHTML += `

                <tr>

                    <td>

                        <strong>

                            ${order.orderNumber}

                        </strong>

                    </td>


                    <td>

                        ${customerName}

                        <br>

                        <small
                            class="text-muted"
                        >

                            ${order.customer?.email || ""}

                        </small>

                    </td>


                    <td>

                        ${date}

                    </td>


                    <td>

                        KES
                        ${Number(
                            order.total || 0
                        ).toLocaleString()}

                    </td>


                    <td>

                        <select
                            class="form-select form-select-sm"
                            onchange="
                                updatePaymentStatus(
                                    '${order._id}',
                                    this.value
                                )
                            "
                        >

                            ${createPaymentOptions(
                                order.paymentStatus
                            )}

                        </select>

                    </td>


                    <td>

                        <select
                            class="form-select form-select-sm"
                            onchange="
                                updateOrderStatus(
                                    '${order._id}',
                                    this.value
                                )
                            "
                        >

                            ${createOrderStatusOptions(
                                order.orderStatus
                            )}

                        </select>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-dark"
                            onclick="
                                viewOrder(
                                    '${order._id}'
                                )
                            "
                        >

                            <i
                                class="bi bi-eye"
                            ></i>

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


// =======================================
// ORDER STATUS OPTIONS
// =======================================

function createOrderStatusOptions(
    currentStatus
) {

    const statuses = [

        "Pending",

        "Confirmed",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled"

    ];


    return statuses
        .map(
            status => `

                <option
                    value="${status}"

                    ${
                        status ===
                        currentStatus
                            ? "selected"
                            : ""
                    }
                >

                    ${status}

                </option>

            `
        )
        .join("");

}


// =======================================
// PAYMENT STATUS OPTIONS
// =======================================

function createPaymentOptions(
    currentStatus
) {

    const statuses = [

        "Pending",

        "Paid",

        "Failed",

        "Refunded"

    ];


    return statuses
        .map(
            status => `

                <option
                    value="${status}"

                    ${
                        status ===
                        currentStatus
                            ? "selected"
                            : ""
                    }
                >

                    ${status}

                </option>

            `
        )
        .join("");

}


// =======================================
// UPDATE ORDER STATUS
// =======================================

async function updateOrderStatus(
    id,
    orderStatus
) {

    await updateOrder(
        id,
        {
            orderStatus
        }
    );

}


// =======================================
// UPDATE PAYMENT STATUS
// =======================================

async function updatePaymentStatus(
    id,
    paymentStatus
) {

    await updateOrder(
        id,
        {
            paymentStatus
        }
    );

}


// =======================================
// SEND ORDER UPDATE
// =======================================

async function updateOrder(
    id,
    updateData
) {

    try {

        const response =
    await fetch(
        `${API_URL}/orders/${id}/status`,
        {
            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${localStorage.getItem("adminToken")}`

            },

            body:
                JSON.stringify({

                    orderStatus,
                    paymentStatus

                })

        }
    );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update order."
            );

        }


        await loadOrders();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Update order error:",
            error
        );


        alert(
            error.message ||
            "Unable to update order."
        );


        await loadOrders();

    }

}


// =======================================
// FILTER ORDERS
// =======================================

const orderFilter =
    document.getElementById(
        "orderFilter"
    );


if (orderFilter) {

    orderFilter.addEventListener(
        "change",
        () => {

            const status =
                orderFilter.value;


            if (
                status === "All"
            ) {

                renderOrders(
                    allOrders
                );

                return;

            }


            const filteredOrders =
                allOrders.filter(
                    order =>
                        order.orderStatus ===
                        status
                );


            renderOrders(
                filteredOrders
            );

        }
    );

}


// =======================================
// VIEW ORDER
// =======================================

async function viewOrder(id) {

    const order =
        allOrders.find(
            item =>
                item._id === id
        );


    if (!order) {

        alert(
            "Order not found."
        );

        return;

    }


    const products =
        order.items
            .map(
                item =>

                    `${item.name}
                     x${item.quantity}
                     - KES ${Number(
                        item.price *
                        item.quantity
                    ).toLocaleString()}`

            )
            .join("\n");


    alert(

`ORDER DETAILS

Order:
${order.orderNumber}

Customer:
${order.customer.firstName}
${order.customer.lastName || ""}

Phone:
${order.customer.phone}

Email:
${order.customer.email}

Products:
${products}

Subtotal:
KES ${Number(
    order.subtotal
).toLocaleString()}

Delivery:
KES ${Number(
    order.deliveryFee
).toLocaleString()}

TOTAL:
KES ${Number(
    order.total
).toLocaleString()}

Payment:
${order.paymentStatus}

Order Status:
${order.orderStatus}`

    );

}


// Load orders when admin opens
loadOrders();
 

// =======================================
// LOAD CUSTOMERS
// =======================================

async function loadCustomers() {

    const table =
        document.getElementById(
            "customersTable"
        );

    if (!table) return;

    const adminToken =
        localStorage.getItem(
            "adminToken"
        );

    try {

        // =======================================
        // GET ALL CUSTOMERS
        // =======================================

        const response =
            await fetch(
                `${API_URL}/customers`,
                {
                    headers: {

                        Authorization:
                            `Bearer ${adminToken}`

                    }
                }
            );

        const customers =
            await response.json();

        if (!response.ok) {

            throw new Error(
                customers.message ||
                "Unable to load customers."
            );

        }


        // =======================================
        // NO CUSTOMERS
        // =======================================

        if (customers.length === 0) {

            table.innerHTML = `

                <tr>

                    <td
                    colspan="5"
                    class="text-center">

                        No customers found.

                    </td>

                </tr>

            `;

            return;

        }


        table.innerHTML = "";


        // =======================================
        // DISPLAY CUSTOMERS
        // =======================================

        for (const customer of customers) {

            let orderCount = 0;


            // ===================================
            // GET CUSTOMER ORDER COUNT
            // ===================================

            try {

                const detailsResponse =
                    await fetch(
                        `${API_URL}/customers/${customer._id}`,
                        {
                            headers: {

                                Authorization:
                                    `Bearer ${adminToken}`

                            }
                        }
                    );

                if (detailsResponse.ok) {

                    const details =
                        await detailsResponse.json();

                    orderCount =
                        details.statistics
                            ?.totalOrders || 0;

                }

            } catch (error) {

                console.error(
                    "Customer order count error:",
                    error
                );

            }


            // ===================================
            // CUSTOMER DETAILS
            // ===================================

            const fullName =
                `${customer.firstName || ""} ${customer.lastName || ""}`
                    .trim();

            const joinedDate =
                customer.createdAt

                    ? new Date(
                        customer.createdAt
                    ).toLocaleDateString()

                    : "-";


            table.innerHTML += `

                <tr>

                    <td>
                        ${fullName || "-"}
                    </td>

                    <td>
                        ${customer.email || "-"}
                    </td>

                    <td>
                        ${customer.phone || "-"}
                    </td>

                    <td>
                        ${orderCount}
                    </td>

                    <td>
                        ${joinedDate}
                    </td>

                </tr>

            `;

        }

    } catch (error) {

        console.error(
            "Load customers error:",
            error
        );

        table.innerHTML = `

            <tr>

                <td
                colspan="5"
                class="text-center text-danger">

                    Unable to load customers.

                </td>

            </tr>

        `;

    }

}

loadCustomers();
// =======================================
// LOAD NEWSLETTER SUBSCRIBERS
// =======================================

async function loadNewsletter() {

    const table =
        document.getElementById("newsletterTable");

    if (!table) return;

    try {
        const response =
        await fetch(
            `${API_URL}/newsletter`,
            {
                headers: {
    
                    Authorization:
                        `Bearer ${localStorage.getItem("adminToken")}`
    
                }
            }
        );
        const subscribers =
            await response.json();

        if (!response.ok) {

            throw new Error(
                subscribers.message ||
                "Unable to load newsletter subscribers."
            );

        }

        if (subscribers.length === 0) {

            table.innerHTML = `

                <tr>

                    <td
                    colspan="3"
                    class="text-center">

                        No newsletter subscribers yet.

                    </td>

                </tr>

            `;

            return;

        }

        table.innerHTML = "";

        subscribers.forEach(subscriber => {

            const subscribedDate =
                subscriber.createdAt
                    ? new Date(
                        subscriber.createdAt
                    ).toLocaleDateString()
                    : "-";

            table.innerHTML += `

                <tr>

                    <td>
                        ${subscriber.email || "-"}
                    </td>

                    <td>
                        ${subscribedDate}
                    </td>

                    <td>

                        <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        onclick="deleteSubscriber('${subscriber._id}')">

                            <i class="bi bi-trash"></i>

                            Remove

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(
            "Load newsletter error:",
            error
        );

        table.innerHTML = `

            <tr>

                <td
                colspan="3"
                class="text-center text-danger">

                    Unable to load newsletter subscribers.

                </td>

            </tr>

        `;

    }

}


// =======================================
// DELETE NEWSLETTER SUBSCRIBER
// =======================================

async function deleteSubscriber(id) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this subscriber?"
        );

    if (!confirmed) return;

    try {

        const response =
    await fetch(
        `${API_URL}/newsletter/${id}`,
        {
            method: "DELETE",

            headers: {

                Authorization:
                    `Bearer ${localStorage.getItem("adminToken")}`

            }
        }
    );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to remove subscriber."
            );

        }

        alert(
            "Subscriber removed successfully!"
        );

        await loadNewsletter();

    } catch (error) {

        console.error(
            "Delete subscriber error:",
            error
        );

        alert(
            error.message ||
            "Unable to remove subscriber."
        );

    }

}


// =======================================
// INITIAL LOAD
// =======================================

loadNewsletter();
 // =======================================
// LOAD ADMIN SETTINGS
// =======================================

async function loadSettings() {

    const storeName =
        document.getElementById("storeName");

    const storeEmail =
        document.getElementById("storeEmail");

    if (!storeName || !storeEmail) return;

    try {

        const response = await fetch(
            `${API_URL}/settings`,
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("adminToken")}`
                }
            }
        );

        const settings = await response.json();

        if (!response.ok) {

            throw new Error(
                settings.message ||
                "Unable to load settings."
            );

        }

        storeName.value =
            settings.storeName || "";

        storeEmail.value =
            settings.storeEmail || "";

    } catch (error) {

        console.error(
            "Load settings error:",
            error
        );

    }

}


// =======================================
// SAVE ADMIN SETTINGS
// =======================================

const adminSettingsForm =
    document.getElementById(
        "adminSettingsForm"
    );

if (adminSettingsForm) {

    adminSettingsForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const storeName =
                document
                    .getElementById("storeName")
                    .value
                    .trim();

            const storeEmail =
                document
                    .getElementById("storeEmail")
                    .value
                    .trim();

            if (!storeName) {

                alert("Store name is required.");

                return;

            }

            try {

                const response =
                    await fetch(
                        `${API_URL}/settings`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${localStorage.getItem("adminToken")}`

                            },

                            body: JSON.stringify({

                                storeName,

                                storeEmail

                            })

                        }
                    );

                const data =
                    await response.json();

                console.log(
                    "Settings response:",
                    data
                );

                if (!response.ok) {

                    console.error(
                        "Server returned:",
                        response.status,
                        data
                    );

                    throw new Error(
                        data.message ||
                        "Unable to save settings."
                    );

                }

                alert(
                    "Settings saved successfully!"
                );

            } catch (error) {

                console.error(
                    "Save settings error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save settings."
                );

            }

        }
    );

}

loadSettings();