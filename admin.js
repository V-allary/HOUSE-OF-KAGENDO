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
// SAVE PRODUCT
// =======================================

const productForm =
document.getElementById("productForm");

if(productForm){

productForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const formData =
new FormData();

formData.append(
"name",
document.getElementById("productName").value
);

formData.append(
"description",
document.getElementById("productDescription").value
);

formData.append(
"category",
document.getElementById("productCategory").value
);

formData.append(
"price",
document.getElementById("productPrice").value
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

)

);

formData.append(
"colors",
JSON.stringify(

document
.getElementById("productColors")
.value
.split(",")

)

);

formData.append(
"featured",
false
);

const images =
document.getElementById("productImages").files;

for(let i=0;i<images.length;i++){

formData.append(
"images",
images[i]
);

}

try{

const response =
await fetch(

"https://house-of-kagendo.onrender.com/products",

{

method:"POST",

body:formData

}

);

const data =
await response.json();

alert(data.message);

productForm.reset();

loadProducts();

}catch(error){

console.log(error);

alert("Failed to save product.");

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