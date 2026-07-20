document.addEventListener("DOMContentLoaded", () => {

    const heroCarousel = document.querySelector("#heroCarousel");
    if (heroCarousel) {
      new bootstrap.Carousel(heroCarousel, {
        interval: 3000,
        pause: false,
        ride: "carousel",
        wrap: true
      });
    }
  
    /* ===============================
       AOS ANIMATIONS
    ================================ */
    AOS.init({
      duration: 1000,
      once: true
    });
  
    /* ===============================
       CONTACT FORM SUBMISSION (JSON)
    ================================ */
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
  
    if (!form || !status) return;
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      status.innerHTML = `<span class="text-info">Sending message...</span>`;
  
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
      };
  
      try {
        const response = await fetch(
          " https://house-of-kagendo.onrender.com/submit-form",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );
  
        const result = await response.json();
  
        if (response.ok && result.success) {
          status.innerHTML = `<span class="text-success">Message sent successfully. Thank you!</span>`;
          form.reset();
        } else {
          throw new Error(result.message || "Failed to send message");
        }
  
      } catch (error) {
        console.error("Form error:", error);
        status.innerHTML = `<span class="text-danger">Something went wrong. Please try again later.</span>`;
      }
    });
  
  });

  // =======================================
// QUICK BUY BUTTONS
// =======================================

document.addEventListener("click", async function (e) {

    const button =
        e.target.closest(".quick-buy-btn");

    if (!button) return;

    e.preventDefault();

    const id =
        button.dataset.id;

    const product =
        await getProduct(id);

    if (!product) return;

    openQuickShop(product);

});


  // =======================================
// QUICK SHOP
// =======================================

let quickProduct = null;

function openQuickShop(product) {

    quickProduct = product;

    document.getElementById("quickProductImage").src =
        product.images && product.images.length
            ? getImageURL(product.images[0])
            : "";

    document.getElementById("quickProductName").innerText =
        product.name;

    document.getElementById("quickProductPrice").innerText =
        "KES " + Number(product.price).toLocaleString();

    document.getElementById("quickQty").value = 1;

    // Sizes
    const sizes =
        document.getElementById("quickSizes");

    sizes.innerHTML = "";

    let selectedSize = "";

    (product.sizes || []).forEach(size => {

        const btn =
            document.createElement("button");

        btn.type = "button";
        btn.className =
            "btn btn-outline-dark me-2 mb-2";

        btn.innerText = size;

        btn.onclick = () => {

            selectedSize = size;

            sizes
                .querySelectorAll("button")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");

        };

        sizes.appendChild(btn);

    });

    // Colours
    const colors =
        document.getElementById("quickColors");

    colors.innerHTML = "";

    let selectedColor = "";

    (product.colors || []).forEach(color => {

        const circle =
            document.createElement("span");

        circle.className =
            "color-circle";

        circle.style.background = color;

        circle.onclick = () => {

            selectedColor = color;

            colors
                .querySelectorAll(".color-circle")
                .forEach(c =>
                    c.classList.remove("active-color")
                );

            circle.classList.add("active-color");

        };

        colors.appendChild(circle);

    });

    quickProduct.selectedSize =
        () => selectedSize;

    quickProduct.selectedColor =
        () => selectedColor;

    new bootstrap.Modal(
        document.getElementById("quickShopModal")
    ).show();

}

 // ========================
// GET CART
// =========================

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

// =========================
// UPDATE CART COUNT
// =========================
function updateCartCount() {

    let totalItems = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

    });

    const desktopCount =
    document.getElementById(
        "desktop-cart-count"
    );

    const mobileCount =
    document.getElementById(
        "mobile-cart-count"
    );

    if(desktopCount){

        desktopCount.innerText =
        totalItems;

    }

    if(mobileCount){

        mobileCount.innerText =
        totalItems;

    }

}

 
 // =========================
// NAVBAR SCROLL EFFECT
// =========================

const navbar = document.querySelector(".index-navbar");

if(navbar){

    window.addEventListener("scroll", () => {

        if(window.scrollY > 50){

            navbar.classList.add("scrolled");

        }else{

            navbar.classList.remove("scrolled");

        }

    });

}

// =========================
// SAVE CART
// =========================

function saveCart() {

localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);

updateCartCount();

}

// =========================
// ADD TO CART
// =========================

const addToCartButtons =
document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {

button.addEventListener("click", () => {

    console.log("Add To Cart clicked");

    const productCard =
        button.closest(".product-card");

    const product = {

        name:
            productCard.dataset.name,

        price:
            productCard.dataset.price,

        image:
            productCard.dataset.image,

        quantity: 1

    };

    // CHECK IF PRODUCT EXISTS
    const existingProduct =
        cart.find(item =>
            item.name === product.name
        );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(product);

    }

    saveCart();

     showCartNotificatio(
        product.name + "added to cart"
     );

});

});

// =========================
// DISPLAY CART ITEMS
// =========================

function displayCartItems() {

const cartItemsContainer =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");

if (!cartItemsContainer) return;

cartItemsContainer.innerHTML = "";

let total = 0;

cart.forEach((item, index) => {

    total +=
        item.price * item.quantity;

    cartItemsContainer.innerHTML += `

    <div class="cart-product">

        <img src="${item.image}"
            class="cart-product-image">

        <div class="cart-product-info">

            <h4>${item.name}</h4>

            <p>KES ${item.price}</p>

            <div class="cart-quantity">

                <button onclick="decreaseQuantity(${index})">

                    -

                </button>

                <span>

                    ${item.quantity}

                </span>

                <button onclick="increaseQuantity(${index})">

                    +

                </button>

            </div>

        </div>

        <button class="remove-btn"
            onclick="removeItem(${index})">

            Remove

        </button>

    </div>

    `;

});

if (cartTotal) {

    cartTotal.innerText =
        "KES " + total;

}

}

// =========================
// REMOVE ITEM
// =========================

function removeItem(index) {

cart.splice(index, 1);

saveCart();

displayCartItems();

}

// =========================
// INCREASE QUANTITY
// =========================

function increaseQuantity(index) {

cart[index].quantity++;

saveCart();

displayCartItems();

}

// =========================
// DECREASE QUANTITY
// =========================

function decreaseQuantity(index) {

if (cart[index].quantity > 1) {

    cart[index].quantity--;

} else {

    cart.splice(index, 1);

}

saveCart();

displayCartItems();

}

// =========================
// INITIALIZE
// =========================

updateCartCount();

displayCartItems();

 
function addToCartFromDetails(){

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    const product = products.find(p => p.id === productId);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if(existing){
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart!");
}

function buyNow(){

    const params =
    new URLSearchParams(
        window.location.search
    );

    const productId =
    parseInt(params.get("id"));

    const product =
    products.find(
        p => p.id === productId
    );

    localStorage.setItem(
        "checkoutProduct",
        JSON.stringify({
            ...product,
            quantity: 1
        })
    );

    window.location.href =
    "checkout.html";

}

function checkoutCart(){

    localStorage.removeItem(
        "checkoutProduct"
    );

    window.location.href =
    "checkout.html";

}

// =========================
// LIVE SEARCH
// =========================

const searchInput =
document.getElementById("search-input");

const searchResults =
document.getElementById("search-results");

if(searchInput){

    searchInput.addEventListener("input", () => {

        const value =
        searchInput.value.toLowerCase();

        searchResults.innerHTML = "";

        if(value === ""){

            searchResults.style.display = "none";

            return;
        }

        const filteredProducts =
        products.filter(product =>

            product.name.toLowerCase().includes(value)
        );

        if(filteredProducts.length === 0){

            searchResults.style.display = "none";

            return;
        }

        searchResults.style.display = "block";

        filteredProducts.forEach(product => {

            searchResults.innerHTML += `

            <div class="search-item"
            onclick="window.location.href='product-details.html?id=${product.id}'">

                <img src="${product.image}">

                <div class="search-info">

                    <h5>${product.name}</h5>

                    <p>KES ${product.price}</p>

                </div>

            </div>

            `;
        });

    });

    // CLOSE SEARCH WHEN CLICKING OUTSIDE

    document.addEventListener("click", (e) => {

        if(!e.target.closest(".luxury-search-box")){

            searchResults.style.display = "none";
        }

    });

}
document.querySelectorAll(".buy-now-btn").forEach(button => {

    button.addEventListener("click", () => {

        const productCard =
        button.closest(".product-card");

        const product = {

            id: productCard.dataset.id,

            name: productCard.dataset.name,

            price: Number(productCard.dataset.price),

            image: productCard.dataset.image,

            quantity: 1

        };

        localStorage.setItem(
            "checkoutProduct",
            JSON.stringify(product)
        );

        window.location.href =
        "checkout.html";

    });

});

// =========================
// PRODUCT SEARCH
// =========================

function setupSearch(inputId, resultsId){

    const searchInput =
    document.getElementById(inputId);

    const searchResults =
    document.getElementById(resultsId);

    if(!searchInput || !searchResults) return;

    searchInput.addEventListener("input", () => {

        const value =
        searchInput.value.toLowerCase().trim();

        searchResults.innerHTML = "";

        if(value === ""){

            searchResults.style.display = "none";

            return;
        }

        const filteredProducts =
        products.filter(product =>

            product.name
            .toLowerCase()
            .includes(value)

        );

        if(filteredProducts.length === 0){

            searchResults.innerHTML = `

            <div class="search-item">

                No products found

            </div>

            `;

            searchResults.style.display = "block";

            return;
        }

        filteredProducts.forEach(product => {

            searchResults.innerHTML += `

            <div class="search-item"
                onclick="window.location.href='product-details.html?id=${product.id}'">

                <img src="${product.images[0]}">

                <div class="search-info">

                    <h5>

                        ${product.name}

                    </h5>

                    <p>

                        KES ${product.price}

                    </p>

                </div>

            </div>

            `;

        });

        searchResults.style.display = "block";

    });

    document.addEventListener("click", (e) => {

        if(
            !e.target.closest(`#${inputId}`) &&
            !e.target.closest(`#${resultsId}`)
        ){

            searchResults.style.display = "none";
        }

    });

}

// DESKTOP SEARCH

setupSearch(
    "search-input",
    "search-results"
);

// MOBILE SEARCH

setupSearch(
    "mobile-search-input",
    "mobile-search-results"
);

const mobileSearchBtn =
document.querySelector(".mobile-search-btn");

const searchOverlay =
document.getElementById("mobileSearchOverlay");


 
function loadRecentSearches(){

    const container =
    document.getElementById("recent-searches");

    if(!container) return;

    

}

loadRecentSearches();
const clearRecent =
document.getElementById("clearRecent");

if(clearRecent){

    clearRecent.addEventListener("click",()=>{

        localStorage.removeItem(
            "recentSearches"
        );

        loadRecentSearches();

    });

}

const openSearch =
document.getElementById("openSearch");

if(openSearch){

    openSearch.addEventListener("click", () => {

        const existingOverlay =
        document.getElementById("mobileSearchOverlay");

        if(existingOverlay) return;

        document.body.insertAdjacentHTML("beforeend", `

        <div class="mobile-search-overlay" id="mobileSearchOverlay">

            <div class="mobile-search-header">

                <i class="bi bi-arrow-left" id="closeSearch"></i>

                <div class="mobile-search-bar">

                    <i class="bi bi-search"></i>

                    <input
                    type="text"
                    id="mobile-search-input"
                    placeholder="Search products...">

                </div>

            </div>

            <div class="search-section">

                <div class="search-heading">

                    <span>Recent Searches</span>

                    <button id="clearRecent">
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

        <span class="popular-search">Apex Set</span>
        <span class="popular-search">Noir Set</span>
        <span class="popular-search">Marv Set</span>
        <span class="popular-search">Pambo Dress</span>
        <span class="popular-search">Zuri Set</span>
        <span class="popular-search">Mosaic</span>

    </div>

</div>

<div class="search-section">

    <h6 class="search-title">
        Suggestions
    </h6>

    <div id="mobile-search-results"></div>

</div>

        `);

        setupSearch(
            "mobile-search-input",
            "mobile-search-results"
        );

        loadRecentSearches();

        document
        .querySelectorAll(".popular-search")
        .forEach(tag => {

            tag.addEventListener("click", () => {

                const input =
                document.getElementById(
                    "mobile-search-input"
                );

                input.value =
                tag.textContent;

                input.dispatchEvent(
                    new Event("input")
                );

            });

        });

        const clearBtn =
        document.getElementById("clearRecent");

        if(clearBtn){

            clearBtn.addEventListener("click", () => {

                localStorage.removeItem(
                    "recentSearches"
                );

                loadRecentSearches();

            });

        }

        const closeBtn =
        document.getElementById("closeSearch");

        if(closeBtn){

            closeBtn.addEventListener("click", () => {

                document
                .getElementById("mobileSearchOverlay")
                .remove();

            });

        }

    });

}



function loadRecentSearches(){

    const container =
    document.getElementById("recent-searches");

    if(!container) return;

    const recent =
    JSON.parse(
        localStorage.getItem("recentSearches")
    ) || [];

    container.innerHTML = "";

    if(recent.length === 0){

        container.innerHTML = `
            <p class="empty-search">
                No recent searches
            </p>
        `;

        return;
    }

    recent.forEach(item => {

        container.innerHTML += `
            <span class="search-tag">
                ${item}
            </span>
        `;

    });

}

 //!CART NOTIFCATION//
function showCartNotification(message){

    const notification =
    document.createElement("div");

    notification.className =
    "cart-notification";

    notification.innerText =
    message;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("show");

    }, 100);

    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {

            notification.remove();

        }, 400);

    }, 2500);

}
const newsletterBtn =
document.getElementById(
    "newsletterBtn"
);

if(newsletterBtn){

    newsletterBtn.addEventListener(
        "click",
        async () => {

            const email =
            document.getElementById(
                "newsletterEmail"
            ).value;

            if(!email){

                alert(
                    "Please enter an email"
                );

                return;
            }

            try{

                const response =
                await fetch(
                    "https://house-of-kagendo.onrender.com/subscribe",
                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:JSON.stringify({
                            email
                        })

                    }
                );

                const data =
                await response.json();

                alert(
                    data.message
                );

            }catch(error){

                alert(
                    "Subscription failed."
                );

            }

        }
    );

}



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

  // =========================
// SHOP PAGE PRODUCTS
// =========================

const productsContainer =
document.getElementById(
    "productsContainer"
);

let shopProducts = [];

// =======================================
// LOAD SHOP PRODUCTS
// =======================================

async function loadShopProducts() {

    if (!productsContainer) return;

    shopProducts =
        await getProducts();

    displayProducts();

}

// =======================================
// DISPLAY PRODUCTS
// =======================================

function displayProducts(
    category = "all"
) {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    const filteredProducts =

        category === "all"

        ? shopProducts

        : shopProducts.filter(product =>

            product.category &&
            product.category.toUpperCase() ===
            category.toUpperCase()

        );

    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `

            <div class="col-12 text-center">

                <h5>

                    No products found.

                </h5>

            </div>

        `;

        return;

    }

    filteredProducts.forEach(product => {

        const image =

            product.images &&
            product.images.length > 0

            ? getImageURL(
                product.images[0]
            )

            : "";

        productsContainer.innerHTML += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div
            class="product-card"

            data-id="${product._id}"

            data-name="${product.name}"

            data-price="${product.price}"

            data-image="${image}">

                <a href="product-details.html?id=${product._id}">

                    <img
                    src="${image}"
                    class="img-fluid"
                    alt="${product.name}">

                </a>

                <div class="product-content">

                    <p class="product-category">

                        ${product.category || ""}

                    </p>

                    <h5>

                        ${product.name}

                    </h5>

                    <p>

                        KES ${Number(
                            product.price
                        ).toLocaleString()}

                    </p>

                    <a
                    href="product-details.html?id=${product._id}"
                    class="buy-now-btn text-decoration-none">

                        Buy Now

                    </a>

                </div>

            </div>

        </div>

        `;

    });

}

// LOAD PRODUCTS

if (productsContainer) {

    loadShopProducts();

}

// CATEGORY FILTER

const categoryFilter =
document.getElementById(
    "categoryFilter"
);

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        () => {

            displayProducts(
                categoryFilter.value
            );

        }
    );

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
// LOAD HOME PAGE PRODUCTS
// =======================================

const homeProducts =
document.getElementById("homeProducts");

async function loadHomeProducts() {

    if (!homeProducts) return;

    const products = await getProducts();

    homeProducts.innerHTML = "";

    const sections = [

        {
            title: "✨ NEW ARRIVALS",
            products: products.filter(p => p.newArrival)
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
            products: products.filter(p => p.bestseller)
        }

    ];

    sections.forEach(section => {

        if(section.products.length === 0) return;

        homeProducts.innerHTML += `

        <div class="col-12 mt-5 mb-4">
            <h2 class="section-title">
                ${section.title}
            </h2>
        </div>

        `;

        section.products.forEach(product => {

            const image =

                product.images &&
                product.images.length

                ? getImageURL(product.images[0])

                : "";

            homeProducts.innerHTML += `

            <div class="col-lg-3 col-md-6 mb-4">

                <div
                    class="product-card"

                    data-id="${product._id}"

                    data-name="${product.name}"

                    data-price="${product.price}"

                    data-image="${image}">

                    <div class="product-image">

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

                            <i class="bi bi-box-arrow-up"></i>

                            <a href="product-details.html?id=${product._id}">
                                <i class="bi bi-cart3"></i>
                            </a>

                        </div>

                    </div>

                    <div class="product-content">

                        <h5>${product.name}</h5>

                        <p>
                            KES ${Number(product.price).toLocaleString()}
                        </p>

                        <a
href="#"
class="buy-now-btn text-decoration-none quick-buy-btn"
data-id="${product._id}">

    Buy Now

</a>

                    </div>

                </div>

            </div>

            `;

        });

    });

}

loadHomeProducts();


// =======================================
// LOAD RELATED PRODUCTS
// =======================================

async function loadRelatedProducts() {

if (!product) return;

const container =
    document.getElementById(
        "relatedProducts"
    );

if (!container) return;

const products =
    await getProducts();

const related =
    products
        .filter(p =>

            p._id !== product._id &&

            p.category === product.category

        )
        .slice(0, 4);

container.innerHTML = "";

related.forEach(item => {

    const image =
        item.images &&
        item.images.length
            ? getImageURL(item.images[0])
            : "";

    container.innerHTML += `

    <div class="col-lg-3 col-md-6 mb-4">

        <div class="product-card">

            <div class="product-image">

                <a href="product-details.html?id=${item._id}">

                    <img
                        src="${image}"
                        class="img-fluid"
                        alt="${item.name}">

                </a>

                <div class="product-icons">

                    <i class="bi bi-heart wishlist-btn"></i>

                    <a href="product-details.html?id=${item._id}">

                        <i class="bi bi-eye"></i>

                    </a>

                    <i class="bi bi-box-arrow-up"></i>

                    <a href="product-details.html?id=${item._id}">

                        <i class="bi bi-cart3"></i>

                    </a>

                </div>

            </div>

            <div class="product-content">

                <h5>${item.name}</h5>

                <p>

                    KES ${Number(item.price).toLocaleString()}

                </p>

                <a
                    href="product-details.html?id=${item._id}"
                    class="buy-now-btn text-decoration-none">

                    Buy Now

                </a>

            </div>

        </div>

    </div>

    `;

});

} 