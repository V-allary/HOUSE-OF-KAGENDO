// =======================================
// HOUSE OF KAGENDO
// MAIN.JS
// =======================================


// =======================================
// HERO CAROUSEL
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    const heroCarousel =
    document.querySelector("#heroCarousel");

    if (heroCarousel) {

        new bootstrap.Carousel(heroCarousel, {

            interval: 3000,

            pause: false,

            ride: "carousel",

            wrap: true

        });

    }

});


// =======================================
// AOS
// =======================================

AOS.init({

    duration: 1000,

    once: true

});


// =======================================
// NAVBAR SCROLL
// =======================================

const navbar =
document.querySelector(".luxury-navbar");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}

// =======================================
// SEARCH SYSTEM
// =======================================

function setupSearch(inputId, resultsId) {

    const searchInput = document.getElementById(inputId);
    const searchResults = document.getElementById(resultsId);

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        searchResults.innerHTML = "";

        if (keyword === "") {

            searchResults.style.display = "none";
            return;

        }

        const filteredProducts = products.filter(product => {

            return (

                product.name.toLowerCase().includes(keyword) ||

                (product.category || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

        if (filteredProducts.length === 0) {

            searchResults.innerHTML = `

                <div class="search-item empty-search">

                    No products found

                </div>

            `;

            searchResults.style.display = "block";

            return;

        }

        filteredProducts.forEach(product => {

            const image = getProductImage(product);

            searchResults.innerHTML += `

                <div
                    class="search-item"
                    data-id="${product._id}">

                    <img
                        src="${image}"
                        alt="${product.name}">

                    <div class="search-info">

                        <h5>${product.name}</h5>

                        <p>

                            ${product.category}

                        </p>

                        <strong>

                            KES ${Number(product.price).toLocaleString()}

                        </strong>

                    </div>

                </div>

            `;

        });

        searchResults.style.display = "block";

        searchResults
            .querySelectorAll(".search-item")
            .forEach(item => {

                item.addEventListener("click", () => {

                    const id = item.dataset.id;

                    saveRecentSearch(
                        item.querySelector("h5").innerText
                    );

                    window.location.href =
                        `product-details.html?id=${id}`;

                });

            });

    });

    document.addEventListener("click", (event) => {

        if (

            !event.target.closest(`#${inputId}`) &&

            !event.target.closest(`#${resultsId}`)

        ) {

            searchResults.style.display = "none";

        }

    });

}

// =======================================
// RECENT SEARCHES
// =======================================

function saveRecentSearch(search) {

    let recent = JSON.parse(

        localStorage.getItem("recentSearches")

    ) || [];

    recent = recent.filter(

        item => item !== search

    );

    recent.unshift(search);

    if (recent.length > 6) {

        recent = recent.slice(0, 6);

    }

    localStorage.setItem(

        "recentSearches",

        JSON.stringify(recent)

    );

}

function loadRecentSearches() {

    const container =
        document.getElementById("recent-searches");

    if (!container) return;

    const recent = JSON.parse(

        localStorage.getItem("recentSearches")

    ) || [];

    container.innerHTML = "";

    if (recent.length === 0) {

        container.innerHTML = `

            <p class="empty-search">

                No recent searches

            </p>

        `;

        return;

    }

    recent.forEach(search => {

        container.innerHTML += `

            <span class="search-tag">

                ${search}

            </span>

        `;

    });

}

// =======================================
// START DESKTOP SEARCH
// =======================================

setupSearch(
    "search-input",
    "search-results"
);

// =======================================
// MOBILE SEARCH
// =======================================

const openSearch =
document.getElementById("openSearch");

if (openSearch) {

    openSearch.addEventListener("click", () => {

        // Prevent opening twice
        if (document.getElementById("mobileSearchOverlay")) {

            return;

        }

        document.body.insertAdjacentHTML(

            "beforeend",

            `

<div
class="mobile-search-overlay"
id="mobileSearchOverlay">

    <div class="mobile-search-header">

        <button
        id="closeSearch"
        class="close-search-btn">

            <i class="bi bi-arrow-left"></i>

        </button>

        <div class="mobile-search-bar">

            <i class="bi bi-search"></i>

            <input
            id="mobile-search-input"
            type="text"
            placeholder="Search House of Kagendo...">

        </div>

    </div>

    <div class="search-section">

        <div class="search-heading">

            <span>

                Recent Searches

            </span>

            <button
            id="clearRecent">

                Clear

            </button>

        </div>

        <div id="recent-searches"></div>

    </div>

    <div class="search-section">

        <h6 class="search-title">

            Popular Searches

        </h6>

        <div class="popular-tags">

            <span class="popular-search">

                Apex Set

            </span>

            <span class="popular-search">

                Marv Set

            </span>

            <span class="popular-search">

                Zuri Set

            </span>

            <span class="popular-search">

                Snug Set

            </span>

        </div>

    </div>

    <div class="search-section">

        <h6 class="search-title">

            Products

        </h6>

        <div id="mobile-search-results"></div>

    </div>

</div>

`

        );

        // Start search

        setupSearch(

            "mobile-search-input",

            "mobile-search-results"

        );

        // Load recent searches

        loadRecentSearches();

        // Popular tags

        document

        .querySelectorAll(".popular-search")

        .forEach(tag => {

            tag.addEventListener("click", () => {

                const input =

                document.getElementById(

                    "mobile-search-input"

                );

                input.value =

                tag.innerText;

                input.dispatchEvent(

                    new Event("input")

                );

            });

        });

        // Clear recent

        const clearRecent =

        document.getElementById(

            "clearRecent"

        );

        if (clearRecent) {

            clearRecent.addEventListener(

                "click",

                () => {

                    localStorage.removeItem(

                        "recentSearches"

                    );

                    loadRecentSearches();

                }

            );

        }

        // Close

        const closeSearch =

        document.getElementById(

            "closeSearch"

        );

        if (closeSearch) {

            closeSearch.addEventListener(

                "click",

                () => {

                    document

                    .getElementById(

                        "mobileSearchOverlay"

                    )

                    .remove();

                }

            );

        }

        // Auto focus

        setTimeout(() => {

            document

            .getElementById(

                "mobile-search-input"

            )

            .focus();

        }, 200);

    });

}



// =========================
// ACCOUNT LINK
// =========================
document
.querySelectorAll(".account-link")
.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        const token =
        localStorage.getItem("token");

        if(token){

            window.location.href =
            "account.html";

        }else{

            window.location.href =
            "signup.html";

        }

    });

});


// =======================================
// CART
// =======================================

let cart =
JSON.parse(
    localStorage.getItem("cart")
) || [];


// =======================================
// UPDATE CART COUNT
// =======================================

function updateCartCount() {

    const total =
    cart.reduce(

        (sum, item) =>

        sum + (item.quantity || 1),

        0

    );

    const desktop =
    document.getElementById(
        "desktop-cart-count"
    );

    const mobile =
    document.getElementById(
        "mobile-cart-count"
    );

    if (desktop) {

        desktop.innerText = total;

    }

    if (mobile) {

        mobile.innerText = total;

    }

}


// =======================================
// SAVE CART
// =======================================

function saveCart() {

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    updateCartCount();

}


// =======================================
// CART NOTIFICATION
// =======================================

function showCartNotification(message){

    const notification =
    document.createElement("div");

    notification.className =
    "cart-notification";

    notification.innerText =
    message;

    document.body.appendChild(notification);

    setTimeout(()=>{

        notification.classList.add("show");

    },100);

    setTimeout(()=>{

        notification.classList.remove("show");

        setTimeout(()=>{

            notification.remove();

        },400);

    },2500);

}

updateCartCount();

function showQuickMessage(message){

    const existing =
    document.querySelector(".quick-message");

    if(existing){
        existing.remove();
    }

    const box =
    document.createElement("div");

    box.className = "quick-message";

    box.innerHTML = `
        <i class="bi bi-exclamation-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(box);

    setTimeout(()=>{

        box.classList.add("show");

    },50);

    setTimeout(()=>{

        box.classList.remove("show");

        setTimeout(()=>{

            box.remove();

        },300);

    },2500);

}
// =======================================
// QUICK ADD TO CART
// =======================================

document.addEventListener("click", function (e) {

    if (e.target.id !== "quickAddCart") return;

    if (!quickProduct) return;

    if (
        quickProduct.sizes?.length &&
        !quickSize
    ) {

        showQuickMessage("Please select a size.");

        return;

    }

    if (
        quickProduct.colors?.length &&
        !quickColor
    ) {
        showQuickMessage("Please select a colour.");
        return;

    }

    const image =
    getProductImage(quickProduct);

    const existing =
    cart.find(item =>

        item.id === quickProduct._id &&

        item.size === quickSize &&

        item.color === quickColor

    );

    if (existing) {

        existing.quantity += quickQuantity;

    } else {

        cart.push({

            id: quickProduct._id,

            name: quickProduct.name,

            price: quickProduct.price,

            image,

            quantity: quickQuantity,

            size: quickSize,

            color: quickColor

        });

    }

    saveCart();

    showCartNotification(
        quickProduct.name +
        " added to cart"
    );

    bootstrap.Modal
        .getInstance(
            document.getElementById("quickShopModal")
        )
        ?.hide();

});


 // =========================
// WISHLIST
// =========================
  
let wishlist =
JSON.parse(
    localStorage.getItem("wishlist")
) || [];

document.addEventListener("click", function (e) {

    const button = e.target.closest(".wishlist-btn");

    if (!button) return;

    const productCard =
    button.closest(".product-card");

    if (!productCard) return;

    const product = {

        id: productCard.dataset.id,

        name: productCard.dataset.name,

        price: productCard.dataset.price,

        image: productCard.dataset.image

    };

    const exists =
    wishlist.find(item => item.id === product.id);

    if (exists) {

        wishlist =
        wishlist.filter(item => item.id !== product.id);

        button.classList.remove("active-heart");

    } else {

        wishlist.push(product);

        button.classList.add("active-heart");

        showCartNotification(
            "♡ " + product.name + " wishlisted"
        );

        if (navigator.vibrate) {

            navigator.vibrate(100);

        }

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

});
 
// =========================
// REMOVE FROM WISHLIST
// =========================

function removeFromWishlist(id){

    let wishlist =
    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    wishlist =
    wishlist.filter(item =>
        item.id != id
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    location.reload();

}
// =======================================
// LOAD PRODUCTS FROM MONGODB
// =======================================

let products = [];
async function loadProducts() {

    try {

        products = await getProducts();

        console.log("Products loaded:", products);

        loadHomeProducts();

        loadShopProducts();

        setupSearch(
            "search-input",
            "search-results"
        );

    } catch (error) {

        console.error(
            "Failed to load products",
            error
        );

        products = [];

    }

}
// =======================================
// GET PRODUCT IMAGE
// =======================================

function getProductImage(product){

    if(
        !product.images ||
        product.images.length === 0
    ){

        return "";

    }

    return getImageURL(
        product.images[0]
    );

}

(async () => {

    await loadProducts();

    loadHomeProducts();

})();

// =======================================
// HOME PAGE PRODUCTS
// =======================================

const homeProducts =
document.getElementById(
    "homeProducts"
);

async function loadHomeProducts() {

    if (!homeProducts) return;

    homeProducts.innerHTML = "";

    const sections = [

        {
            title: "✨ NEW ARRIVALS",
            products: products.filter(
                p => p.newArrival
            )
        },

        {
            title: "EXECUTIVE WEAR",
            products: products.filter(
                p => p.category === "EXECUTIVE WEAR"
            )
        },

        {
            title: "LOUNGE WEAR",
            products: products.filter(
                p => p.category === "LOUNGE WEAR"
            )
        },

        {
            title: "CASUAL WEAR",
            products: products.filter(
                p => p.category === "CASUAL WEAR"
            )
        },

        {
            title: "🔥 BEST SELLERS",
            products: products.filter(
                p => p.bestseller
            )
        }

    ];

    sections.forEach(section => {

        if (
            section.products.length === 0
        ) return;
        homeProducts.innerHTML += `

<div class="col-12 mb-4 mt-5">

    <div class="category-heading">

        <h3>

            ${section.title}

        </h3>

        <div class="category-line"></div>

    </div>

</div>

`;

        section.products.forEach(product => {

            const image =
            getProductImage(product);

            homeProducts.innerHTML += `

            <div class="col-lg-3 col-md-6 mb-4">

                      <div
                       class="product-card ${product.stock <= 0 ? "sold-out-card" : ""}"

                        data-id="${product._id}"

                         data-name="${product.name}"

                        data-price="${product.price}"

                        data-image="${image}">



                        <div class="product-image">

                        ${product.stock <= 0 ? `

                            <div class="sold-out-badge">
                            
                                SOLD OUT
                            
                            </div>
                            
                            `
                            
                            : product.stock <= 3 ? `
                            
                            <div class="low-stock-badge danger">
                            
                                🔥 Only ${product.stock} Left
                            
                            </div>
                            
                            `
                            
                            : product.stock <= 8 ? `
                            
                            <div class="low-stock-badge">
                            
                                Low Stock
                            
                            </div>
                            
                            `
                            
                            : ""}
                        <a href="product-details.html?id=${product._id}">

                            <img
                            src="${image}"
                            class="img-fluid"
                            alt="${product.name}">

                        </a>

                        <div class="product-icons">

                            <i class="bi bi-heart wishlist-btn"></i>

                            <a href="product-details.html?id=${product._id}">

                                <i class="bi bi-eye"></i>

                            </a>


                            ${product.stock > 0 ? `

                                 <i
                             class="bi bi-box-arrow-up quick-buy-btn"
                            data-id="${product._id}">
                              </i>

                              <i
                               class="bi bi-cart3 quick-buy-btn"
                           data-id="${product._id}">
                           </i>

                           ` : ""}

                            
                        </div>

                    </div>

                    <div class="product-content">

                        <h5>

                            ${product.name}

                        </h5>

                        <p>

                            KES ${Number(product.price).toLocaleString()}

                        </p>

                        <button

                       class="buy-now-btn quick-buy-btn"

                     data-id="${product._id}"

                     ${product.stock <= 0 ? "disabled" : ""}>

                    ${product.stock <= 0 ? "Sold Out" : "Buy Now"}

                      </button>

                    </div>

                </div>

            </div>

            `;

        });

    });

}

// =======================================
// QUICK SHOP
// =======================================

let quickProduct = null;

let quickSize = "";

let quickColor = "";

let quickQuantity = 1;

document.addEventListener("click", async (e) => {

    const button =
    e.target.closest(".quick-buy-btn");

    if (!button) return;

    e.preventDefault();

    const id =
    button.dataset.id;

    quickProduct =
    await getProduct(id);

    if (!quickProduct) return;

    openQuickShop();

});
function openQuickShop(){

    const modal =
    new bootstrap.Modal(
        document.getElementById("quickShopModal")
    );

    quickSize = "";

    quickColor = "";

    quickQuantity = 1;

    document.getElementById(
        "quickProductImage"
    ).src =
    getProductImage(quickProduct);

    document.getElementById(
        "quickProductName"
    ).innerText =
    quickProduct.name;

    document.getElementById(
        "quickProductPrice"
    ).innerText =
    "KES " +
    Number(
        quickProduct.price
    ).toLocaleString();
    document.getElementById(
        "quickProductDescription"
    ).innerText =
    quickProduct.description || "";
    document.getElementById(
        "quickQty"
    ).innerText = "1";

    loadQuickSizes();

    loadQuickColours();

    modal.show();

}
function loadQuickSizes(){

    const box =
    document.getElementById("quickSizes");

    box.innerHTML = "";

    (quickProduct.sizes || []).forEach(size=>{

        const btn =
        document.createElement("button");

        btn.type="button";

        btn.className="size-btn";

        btn.innerText=size;

        btn.onclick=()=>{

            quickSize=size;

            box.querySelectorAll(".size-btn")
            .forEach(item=>

                item.classList.remove("active-size")

            );

            btn.classList.add("active-size");

        };

        box.appendChild(btn);

    });

}
function loadQuickColours(){

    const box =
    document.getElementById("quickColors");

    box.innerHTML = "";

    (quickProduct.colors || []).forEach(colour=>{

        const circle =
        document.createElement("span");

        circle.className =
        "color-circle";

        circle.style.background =
        colour;

        circle.onclick=()=>{

            quickColor=colour;

            box.querySelectorAll(".color-circle")
            .forEach(item=>

                item.classList.remove("active-color")

            );

            circle.classList.add("active-color");

        };

        box.appendChild(circle);

    });

}
// =======================================
// QUICK QUANTITY
// =======================================

document.addEventListener("click", function (e) {

    if (e.target.id === "quickPlus") {

        quickQuantity++;

        document.getElementById(
            "quickQty"
        ).innerText = quickQuantity;

    }

    if (e.target.id === "quickMinus") {

        if (quickQuantity > 1) {

            quickQuantity--;

            document.getElementById(
                "quickQty"
            ).innerText = quickQuantity;

        }

    }

});
// =======================================
// QUICK ADD TO CART
// =======================================

document.addEventListener("click", function (e) {

    if (e.target.id !== "quickAddCart") return;

    if (!quickProduct) return;

    if (
        quickProduct.sizes?.length &&
        !quickSize
    ) {

        showQuickMessage("Please select a size.");

        return;

    }

    if (
        quickProduct.colors?.length &&
        !quickColor
    ) {

        showQuickMessage("Please select a colour.");

        return;

    }

    const image =
    getProductImage(quickProduct);

    const existing =
    cart.find(item =>

        item.id === quickProduct._id &&

        item.size === quickSize &&

        item.color === quickColor

    );

    if (existing) {

        existing.quantity += quickQuantity;

    } else {

        cart.push({

            id: quickProduct._id,

            name: quickProduct.name,

            price: quickProduct.price,

            image,

            quantity: quickQuantity,

            size: quickSize,

            color: quickColor

        });

    }

    saveCart();

    showCartNotification(
        quickProduct.name +
        " added to cart"
    );

    bootstrap.Modal
        .getInstance(
            document.getElementById("quickShopModal")
        )
        ?.hide();

});

// =======================================
// QUICK BUY NOW
// =======================================

document.addEventListener("click", function (e) {

    if (e.target.id !== "quickBuyNow") return;

    if (!quickProduct) return;

    if (
        quickProduct.sizes?.length &&
        !quickSize
    ) {

        showQuickMessage("Please select a size.");
        return;

    }

    if (
        quickProduct.colors?.length &&
        !quickColor
    ) {
        showQuickMessage("Please select a colour.");
        return;

    }

    const image =
    getProductImage(quickProduct);

    localStorage.setItem(

        "checkoutProduct",

        JSON.stringify({

            id: quickProduct._id,

            name: quickProduct.name,

            price: quickProduct.price,

            image,

            quantity: quickQuantity,

            size: quickSize,

            color: quickColor

        })

    );

    bootstrap.Modal
        .getInstance(
            document.getElementById("quickShopModal")
        )
        ?.hide();

    window.location.href =
    "checkout.html";

});

document.addEventListener("click", function(e){

    if(e.target.id !== "quickViewDetails") return;

    e.preventDefault();

    bootstrap.Modal
    .getInstance(
        document.getElementById("quickShopModal")
    )
    ?.hide();

    window.location.href =
    "product-details.html?id=" +
    quickProduct._id;

});

 // =======================================
// SHOP PAGE PRODUCTS
// =======================================

function renderShopSection(title, items, container) {

    if (!items.length) return;

    container.innerHTML += `

    <div class="col-12 mt-5 mb-4">

        <div class="category-heading">

            <h3>${title}</h3>

            <div class="category-line"></div>

        </div>

    </div>

    `;

    items.forEach(product => {

        const image = getProductImage(product);

        container.innerHTML += `

                        <div class="col-lg-3 col-md-6 mb-4">

                         <div
                        class="product-card ${product.stock <= 0 ? "sold-out-card" : ""}"

                       data-id="${product._id}"

                       data-name="${product.name}"

                       data-price="${product.price}"

                     data-image="${image}">

                           <div class="product-image">

                           ${product.stock <= 0 ? `

                            <div class="sold-out-badge">
                            
                                SOLD OUT
                            
                            </div>
                            
                            `
                            
                            : product.stock <= 3 ? `
                            
                            <div class="low-stock-badge danger">
                            
                                🔥 Only ${product.stock} Left
                            
                            </div>
                            
                            `
                            
                            : product.stock <= 8 ? `
                            
                            <div class="low-stock-badge">
                            
                                Low Stock
                            
                            </div>
                            
                            `
                            
                            : ""}
                    <a href="product-details.html?id=${product._id}">

                        <img
                        src="${image}"
                        alt="${product.name}">

                    </a>

                    <div class="product-icons">

                        <i class="bi bi-heart wishlist-btn"></i>

                        <a href="product-details.html?id=${product._id}">
                            <i class="bi bi-eye"></i>
                        </a>


                        ${product.stock > 0 ? `

                            <i
                            class="bi bi-box-arrow-up quick-buy-btn"
                            data-id="${product._id}">
                            </i>
                            
                            <i
                            class="bi bi-cart3 quick-buy-btn"
                            data-id="${product._id}">
                            </i>
                            
                            ` : ""}
 

                    </div>

                </div>

                <div class="product-content">

                    <h5>${product.name}</h5>

                    <p>
                        KES ${Number(product.price).toLocaleString()}
                    </p>

                     <button

                    class="buy-now-btn quick-buy-btn"

                   data-id="${product._id}"

                  ${product.stock <= 0 ? "disabled" : ""}>

                  ${product.stock <= 0 ? "Sold Out" : "Buy Now"}

                  </button>

                </div>

            </div>

        </div>

        `;

    });

}

function loadShopProducts(productList = products){

    const container =
    document.getElementById("productsContainer");

    if(!container) return;

    container.innerHTML = "";

    if(productList.length === 0){

        container.innerHTML = `

        <div class="col-12 text-center py-5">

            <h3>No products yet.</h3>

            <button
            id="resetFilters"
            class="btn btn-dark mt-3">

                Try again Later

            </button>

        </div>

        `;

        document
        .getElementById("resetFilters")
        ?.addEventListener("click", () => {

            document.getElementById("categoryFilter").value = "all";
            document.getElementById("priceFilter").selectedIndex = 0;
            document.getElementById("sortFilter").selectedIndex = 0;

            loadShopProducts(products);

        });

        return;

    }

    renderShopSection(
        "✨ NEW ARRIVALS",
        productList.filter(p => p.newArrival),
        container
    );

    renderShopSection(
        "EXECUTIVE WEAR",
        productList.filter(p => p.category === "EXECUTIVE WEAR"),
        container
    );

    renderShopSection(
        "LOUNGE WEAR",
        productList.filter(p => p.category === "LOUNGE WEAR"),
        container
    );

    renderShopSection(
        "CASUAL WEAR",
        productList.filter(p => p.category === "CASUAL WEAR"),
        container
    );

    renderShopSection(
        "🔥 BEST SELLERS",
        productList.filter(p => p.bestseller),
        container
    );

}

function filterShopProducts(){

    let filtered = [...products];

    const category =
    document.getElementById("categoryFilter")?.value;

    const price =
    document.getElementById("priceFilter")?.value;

    const sort =
    document.getElementById("sortFilter")?.value;

    // CATEGORY

    if(category && category !== "all"){

        if(category === "NEW ARRIVALS"){

            filtered =
            filtered.filter(p => p.newArrival);

        }

        else if(category === "BEST SELLERS"){

            filtered =
            filtered.filter(p => p.bestseller);

        }

        else{

            filtered =
            filtered.filter(
                p => p.category === category
            );

        }

    }

    // PRICE

    if(price === "Under KES 5,000"){

        filtered =
        filtered.filter(p => p.price < 5000);

    }

    if(price === "KES 5,000 - 10,000"){

        filtered =
        filtered.filter(
            p => p.price >= 5000 &&
            p.price <= 10000
        );

    }

    if(price === "Above KES 10,000"){

        filtered =
        filtered.filter(
            p => p.price > 10000
        );

    }

    // SORT

    if(sort === "Newest"){

        filtered.sort(

            (a,b)=>

            new Date(b.createdAt)-
            new Date(a.createdAt)

        );

    }

    if(sort === "Price: Low to High"){

        filtered.sort(

            (a,b)=>a.price-b.price

        );

    }

    if(sort === "Price: High to Low"){

        filtered.sort(

            (a,b)=>b.price-a.price

        );

    }

    loadShopProducts(filtered);

}

document
.getElementById("categoryFilter")
?.addEventListener("change", filterShopProducts);

document
.getElementById("priceFilter")
?.addEventListener("change", filterShopProducts);

document
.getElementById("sortFilter")
?.addEventListener("change", filterShopProducts);


// =======================================
// CONTACT FORM
// =======================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = contactForm.querySelector("button");
        button.disabled = true;
        button.innerText = "Sending...";

        try {

            const response = await fetch("https://houseofkagendo.com/submit-form", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: document.getElementById("name").value,

                    email: document.getElementById("email").value,

                    subject: document.getElementById("subject").value,

                    message: document.getElementById("message").value

                })

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("Message sent successfully!");

            contactForm.reset();

        } catch (error) {

            alert(error.message || "Failed to send message.");

        } finally {

            button.disabled = false;
            button.innerText = "SEND MESSAGE";

        }

    });

}