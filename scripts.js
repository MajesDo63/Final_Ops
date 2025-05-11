// Asegurar admin en users
let users = JSON.parse(localStorage.getItem('users')) || [];
if (!users.find(u => u.name === 'admin')) {
    users.push({ name: 'admin', password: 'admin123', role: 'admin' });
    localStorage.setItem('users', JSON.stringify(users));
}

// Carrusel
let currentSlide = 0;
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-img');
const totalSlides = slides.length;

function updateWidth() {
    if (track) {
        track.style.width = `${100 * totalSlides}%`;
        slides.forEach(slide => {
            slide.style.width = `${100 / totalSlides}%`;
        });
    }
}

updateWidth();

setInterval(() => {
    if (track) {
        currentSlide = (currentSlide + 1) % totalSlides;
        track.style.transform = `translateX(-${(100 / totalSlides) * currentSlide}%)`;
    }
}, 5000);

// Carrito actualizado

window.addToCart = function(productName) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.name === productName);
    const cartItem = cart.find(c => c.name === productName);

    if (!product || product.quantity <= 0) {
        alert('No hay más productos');
        return;
    }

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name: product.name, price: product.price, quantity: 1 });
    }

    product.quantity -= 1;
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} agregado al carrito`);
    updateCartCount();
    loadIndexProducts();
};


// Registro solo de clientes
window.registerUser = function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.name === name)) {
        alert('El usuario ya existe.');
        return;
    }

    users.push({ name, password, role: 'cliente' });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
    window.location.href = 'login.html';
};

// Login
window.loginUser = function(event) {
    event.preventDefault();
    const name = document.getElementById('loginName').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.name === name && u.password === password);

    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        alert('Bienvenido ' + user.name);
        window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
};

// Admin protección
window.protectAdminPage = function() {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (!user || user.role !== 'admin') {
        alert('Acceso denegado');
        window.location.href = 'login.html';
    } else {
        loadAdminProducts();
    }
};

// CRUD productos en admin
window.loadAdminProducts = function() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const container = document.getElementById('admin-products');
    if (!container) return;

    container.innerHTML = '';
    products.forEach((p, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
    <input type="text" id="name-${index}" value="${p.name}">
    <input type="number" id="price-${index}" value="${p.price}">
    <input type="number" id="quantity-${index}" value="${p.quantity}">
    <select id="category-${index}">
        <option value="recomendados" ${p.category === 'recomendados' ? 'selected' : ''}>Recomendados</option>
        <option value="mangas" ${p.category === 'mangas' ? 'selected' : ''}>Mangas</option>
        <option value="comics" ${p.category === 'comics' ? 'selected' : ''}>Cómics</option>
        <option value="novelas" ${p.category === 'novelas' ? 'selected' : ''}>Novelas</option>
    </select>
    <input type="file" id="imageFile-${index}" accept="image/*">
    <img class="admin-image" src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}">
    <button onclick="updateProduct(${index})">Actualizar</button>
    <button onclick="deleteProduct(${index})">Eliminar</button>
`;

        container.appendChild(div);
        document.getElementById(`imageFile-${index}`).addEventListener('change', function () {
    this.classList.add('has-image');
});

    });
};

//Se agrego para subir imagenes
window.addProduct = function(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const category = document.getElementById('productCategory').value;
    const fileInput = document.getElementById('productImage');
    const imageFile = fileInput.files[0];

    if (!imageFile) {
        alert('Debes seleccionar una imagen');
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        const imageBase64 = reader.result;

        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push({ name, price, category, quantity, image: imageBase64 });
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
    };

    reader.readAsDataURL(imageFile); // convierte a base64
};




window.updateProduct = function(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const name = document.getElementById(`name-${index}`).value;
    const price = parseFloat(document.getElementById(`price-${index}`).value);
    const quantity = parseInt(document.getElementById(`quantity-${index}`).value);
    const category = document.getElementById(`category-${index}`).value;
    const imageInput = document.getElementById(`imageFile-${index}`);
    let image = products[index].image;

    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function() {
            image = reader.result;
            products[index] = { name, price, quantity, category, image };
            localStorage.setItem('products', JSON.stringify(products));
            loadAdminProducts();
            imageInput.value = ""; // limpia el input después de actualizar
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        products[index] = { name, price, quantity, category, image };
        localStorage.setItem('products', JSON.stringify(products));
        loadAdminProducts();
    }
};




window.deleteProduct = function(index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    loadAdminProducts();
};

window.logout = function() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
};



//Reflejar productos al index
window.loadIndexProducts = function() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const sections = {
        recomendados: document.getElementById('recomendados-section'),
        mangas: document.getElementById('mangas-section'),
        comics: document.getElementById('comics-section'),
        novelas: document.getElementById('novelas-section')
    };

    Object.values(sections).forEach(sec => sec.innerHTML = ''); // limpiar

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}">
            <p class="product-title">${p.name}</p>
            <p class="price">$${p.price} MXN - Cantidad: ${p.quantity}</p>
            <button onclick="addToCart('${p.name}')">Agregar al Carrito</button>
        `;
        if (sections[p.category]) {
            sections[p.category].appendChild(div);
        }
    });
};


const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/login.html';
    });
}
 


// Carrito en cart.html
window.renderCart = function() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>El carrito está vacío.</p>';
        totalPrice.innerText = '';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            ${item.name} - $${item.price} MXN × 
            <input type="number" id="cart-qty-${index}" value="${item.quantity}" min="1">
            <button onclick="updateCartItem(${index})">Actualizar</button>
            <button onclick="removeCartItem(${index})">Eliminar</button>
        `;
        cartItems.appendChild(div);
        total += item.price * item.quantity;
    });
    totalPrice.innerText = `Total: $${total} MXN`;
};

window.updateCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const newQty = parseInt(document.getElementById(`cart-qty-${index}`).value);
    const cartItem = cart[index];
    const product = products.find(p => p.name === cartItem.name);

    const totalAvailable = product.quantity + cartItem.quantity; // lo que hay afuera + en carrito

    if (newQty > totalAvailable) {
        alert('No hay más productos');
        return;
    }

    // Devolver al stock la diferencia previa
    product.quantity = totalAvailable - newQty;
    cartItem.quantity = newQty;

    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    loadIndexProducts();
};


window.removeCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const cartItem = cart[index];
    const product = products.find(p => p.name === cartItem.name);

    if (product) {
        product.quantity += cartItem.quantity;
    }

    cart.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    loadIndexProducts();
};


window.emptyCart = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Devolver stock al inventario
    cart.forEach(cartItem => {
        const product = products.find(p => p.name === cartItem.name);
        if (product) {
            product.quantity += 1;
        }
    });

    // Limpiar carrito
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify([]));
    renderCart();
    loadIndexProducts(); // refresca productos en index
};


window.simulatePayment = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('¡Gracias por tu compra!');
    localStorage.setItem('cart', JSON.stringify([]));
    renderCart();
};


function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartCount) cartCount.innerText = cart.length;
}

window.addEventListener('DOMContentLoaded', updateCartCount);
//Lo arregle como QA