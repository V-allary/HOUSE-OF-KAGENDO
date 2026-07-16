// =======================================
// SHOW / HIDE PASSWORD
// =======================================

const togglePassword =
document.getElementById("togglePassword");

const password =
document.getElementById("adminPassword");

if(togglePassword){

    togglePassword.addEventListener("click",()=>{

        if(password.type==="password"){

            password.type="text";

            togglePassword.classList.remove("bi-eye-slash");
            togglePassword.classList.add("bi-eye");

        }else{

            password.type="password";

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

if(loginForm){

loginForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email =
    document.getElementById("adminEmail").value.trim();

    const password =
    document.getElementById("adminPassword").value.trim();

    // CHANGE THESE TO THE OWNER'S DETAILS

    const adminEmail =
    "houseofka@gmail.com";

    const adminPassword =
    "HouseOfKa2026";

    if(

        email===adminEmail &&
        password===adminPassword

    ){

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        window.location.href =
        "admin.html";

    }else{

        document.getElementById(
            "loginError"
        ).innerText =
        "Invalid email or password.";

    }

});

}

// =======================================
// SHOW PRODUCT FORM
// =======================================

const showProductForm =
document.getElementById("showProductForm");

const productFormContainer =
document.getElementById("productFormContainer");

if(showProductForm){

showProductForm.addEventListener("click",()=>{

if(productFormContainer.style.display==="none"){

productFormContainer.style.display="block";

showProductForm.innerHTML=`

<i class="bi bi-x-circle"></i>

Close

`;

}else{

productFormContainer.style.display="none";

showProductForm.innerHTML=`

<i class="bi bi-plus-circle"></i>

Add New Product

`;

}

});

}
 
// =======================================
// LOAD PRODUCTS
// =======================================

async function loadProducts(){

    const table =
    document.getElementById("productsTable");
    
    if(!table) return;
    
    try{
    
    const response =
    await fetch(
    
    "https://house-of-kagendo.onrender.com/products"
    
    );
    
    const products =
    await response.json();
    
    if(products.length===0){
    
    table.innerHTML=`
    
    <tr>
    
    <td colspan="6"
    class="text-center">
    
    No products found.
    
    </td>
    
    </tr>
    
    `;
    
    return;
    
    }
    
    table.innerHTML="";
    
    products.forEach(product=>{
    
    table.innerHTML+=`
    
    <tr>
    
    <td>
    
    <img
    src="https://house-of-kagendo.onrender.com${product.images[0]}"
    style="
    width:70px;
    height:80px;
    object-fit:cover;
    border-radius:8px;">
    
    </td>
    
    <td>
    
    ${product.name}
    
    </td>
    
    <td>
    
    ${product.category}
    
    </td>
    
    <td>
    
    KES ${product.price.toLocaleString()}
    
    </td>
    
    <td>
    
    ${product.stock}
    
    </td>
    
    <td>
    <button
class="btn btn-sm btn-warning"
onclick="editProduct('${product._id}')">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-sm btn-danger ms-2"
onclick="deleteProduct('${product._id}')">

<i class="bi bi-trash"></i>

</button>
     
    
    </td>
    
    </tr>
    
    `;
    
    });
    
    }catch(error){
    
    console.log(error);
    
    }
    
    }
    
    loadProducts();

    // =======================================
// DELETE PRODUCT
// =======================================

async function deleteProduct(id){

    const confirmed =
    confirm(
    "Delete this product?"
    );
    
    if(!confirmed) return;
    
    try{
    
    const response =
    await fetch(
    
    `https://house-of-kagendo.onrender.com/products/${id}`,
    
    {
    
    method:"DELETE"
    
    }
    
    );
    
    const data =
    await response.json();
    
    alert(data.message);
    
    loadProducts();
    
    }catch(error){
    
    alert("Unable to delete product.");
    
    }
    
    }

    // ======================================
// LOAD DASHBOARD STATISTICS
// ======================================

function loadDashboard() {

    // Products
    const products =
        JSON.parse(localStorage.getItem("products")) || [];

    // Orders
    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    // Customers
    const customers =
        JSON.parse(localStorage.getItem("customers")) || [];

    // Count totals
    document.getElementById("totalProducts").innerText =
        products.length;

    document.getElementById("totalOrders").innerText =
        orders.length;

    document.getElementById("totalCustomers").innerText =
        customers.length;

    // Revenue
    let revenue = 0;

    orders.forEach(order => {

        revenue += Number(order.total || 0);

    });

    document.getElementById("totalRevenue").innerText =
        "KES " + revenue.toLocaleString();

}

loadDashboard();

// ======================================
// SAVE PRODUCT
// ======================================

const productForm =
document.getElementById("productForm");

if(productForm){

productForm.addEventListener("submit",function(e){

e.preventDefault();

const products =
JSON.parse(localStorage.getItem("products")) || [];

const product = {

id: Date.now(),

name:
document.getElementById("productName").value,

price:
Number(document.getElementById("productPrice").value),

category:
document.getElementById("productCategory").value,

description:
document.getElementById("productDescription").value,

stock:
Number(document.getElementById("productStock").value),

image:
document.getElementById("productImage").value,

sizes:
document.getElementById("productSizes").value
.split(","),

colors:
document.getElementById("productColors").value
.split(",")

};

products.push(product);

localStorage.setItem(
"products",
JSON.stringify(products)
);

alert("Product Added Successfully!");

productForm.reset();

loadDashboard();

renderProducts();

});

}
// ======================================
// DISPLAY PRODUCTS
// ======================================

function renderProducts(){

    const products =
    JSON.parse(localStorage.getItem("products")) || [];
    
    const table =
    document.getElementById("productsTable");
    
    if(!table) return;
    
    table.innerHTML = "";
    
    products.forEach(product=>{
    
    table.innerHTML += `
    
    <tr>
    
    <td>
    
    <img
    src="${product.image}"
    style="width:70px;height:90px;object-fit:cover;border-radius:8px;">
    
    </td>
    
    <td>${product.name}</td>
    
    <td>${product.category}</td>
    
    <td>KES ${product.price.toLocaleString()}</td>
    
    <td>${product.stock}</td>
    
    <td>
    
    <button
    class="btn btn-sm btn-outline-primary">
    
    Edit
    
    </button>
    
    <button
    class="btn btn-sm btn-outline-danger ms-2"
    onclick="deleteProduct(${product.id})">
    
    Delete
    
    </button>
    
    </td>
    
    </tr>
    
    `;
    
    });
    
    }
    
    renderProducts();
    // ======================================
// DELETE PRODUCT
// ======================================

function deleteProduct(id){

    let products =
    JSON.parse(localStorage.getItem("products")) || [];
    
    products =
    products.filter(product => product.id !== id);
    
    localStorage.setItem(
    "products",
    JSON.stringify(products)
    );
    
    renderProducts();
    
    loadDashboard();
    
    }