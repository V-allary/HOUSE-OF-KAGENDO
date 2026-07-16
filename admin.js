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
    
    (`${API_URL}/products`)
    
    );
    
    document.getElementById("totalProducts").innerText =
products.length;
    
    if(products.length===0){
    
    table.innerHTML=`
    
    <tr>
    
    <td colspan="6"
    class="text-center">
    
    No products have been added yet.
Click "Add New Product" to create your first product.
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
    
    `${API_URL}/products/${id}`,
    
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
 // =======================================
// SAVE PRODUCT TO MONGODB
// =======================================

const productForm =
document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "name",
            document.getElementById("productName").value
        );

        formData.append(
            "price",
            document.getElementById("productPrice").value
        );

        formData.append(
            "category",
            document.getElementById("productCategory").value
        );

        formData.append(
            "description",
            document.getElementById("productDescription").value
        );

        formData.append(
            "stock",
            document.getElementById("productStock").value
        );

        formData.append(
            "sizes",
            JSON.stringify(
                document
                    .getElementById("productSizes")
                    .value
                    .split(",")
                    .map(size => size.trim())
            )
        );

        formData.append(
            "colors",
            JSON.stringify(
                document
                    .getElementById("productColors")
                    .value
                    .split(",")
                    .map(color => color.trim())
            )
        );

        formData.append(
            "featured",
            false
        );

        const imageFiles =
        document.getElementById("productImages").files;

        for (let i = 0; i < imageFiles.length; i++) {

            formData.append(
                "images",
                imageFiles[i]
            );

        }

        try {

            const API_URL =
            window.location.hostname === "127.0.0.1"
            ? "http://127.0.0.1:5000"
            : "https://house-of-kagendo.onrender.com";
            
            const response =
            await fetch(`${API_URL}/products`,{
            method:"POST",
            body:formData
            });

            const data =
            await response.json();

            if (!response.ok) {

                throw new Error(data.message);

            }

            alert("Product added successfully!");

            productForm.reset();

            productFormContainer.style.display = "none";

            showProductForm.innerHTML = `
                <i class="bi bi-plus-circle"></i>
                Add New Product
            `;

            await loadProducts();

            loadDashboard();

        } catch (error) {

            console.error(error);

            alert(
                error.message || "Unable to save product."
            );

        }

    });

}