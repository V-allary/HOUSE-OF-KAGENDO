const contactForm =
document.getElementById("contactForm");

if(contactForm){

    contactForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const response =
            await fetch("/contact", {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    name:
                    document.getElementById("name").value,

                    email:
                    document.getElementById("email").value,

                    subject:
                    document.getElementById("subject").value,

                    message:
                    document.getElementById("message").value

                })

            });

            const data =
            await response.json();

            if(data.success){

                showCartNotification(
                    "Message sent successfully ✨"
                );

                contactForm.reset();

            }else{

                showCartNotification(
                    "Failed to send message"
                );

            }

        }

    );

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
                    "http://localhost:5000/subscribe",
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

document
.querySelectorAll(".wishlist-btn")
.forEach(button => {

    button.addEventListener("click", () => {

        const productCard =
        button.closest(".product-card");

        const product = {

            id:
            productCard.dataset.id,

            name:
            productCard.dataset.name,

            price:
            productCard.dataset.price,

            image:
            productCard.dataset.image

        };

        const exists =
        wishlist.find(item =>
            item.id === product.id
        );

        if(exists){

            wishlist =
            wishlist.filter(item =>
                item.id !== product.id
            );

            button.classList.remove(
                "active-heart"
            );

        }else{

            wishlist.push(product);

            button.classList.add(
                "active-heart"
            );
            showCartNotification(
                "♡ " + product.name + " wishlisted"
            );

            // MOBILE VIBRATION
            if(navigator.vibrate){

                navigator.vibrate(100);

            }

        }

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

    });

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

function displayProducts(
    category = "all"
){

    if(!productsContainer) return;

    productsContainer.innerHTML = "";

    const filteredProducts =

    category === "all"

    ? products

    : products.filter(product =>

        product.category === category

    );

    filteredProducts.forEach(product => {

        productsContainer.innerHTML += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="product-card">

                <a href="product-details.html?id=${product.id}">
                    <img
                    src="${product.images[0]}"
                    class="img-fluid"
                    alt="${product.name}">
                </a>

                <div class="product-content">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h5>
                        ${product.name}
                    </h5>

                    <p>
                        KES ${product.price}
                    </p>

                </div>

            </div>

        </div>

        `;

    });

}

// LOAD PRODUCTS WHEN PAGE OPENS
if(productsContainer){

    displayProducts();

}

// CATEGORY FILTER
const categoryFilter =
document.getElementById("categoryFilter");

if(categoryFilter){

    categoryFilter.addEventListener(
        "change",
        () => {

            displayProducts(
                categoryFilter.value
            );

        }
    );

}