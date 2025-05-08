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

// Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, price) {
    cart.push({ name: product, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;
    alert(`${product} agregado al carrito!`);
}


// Registro de usuario
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.name.value;
        const password = this.password.value;
        localStorage.setItem('registeredUser', JSON.stringify({ name, password }));
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = '/login.html';
    });
}

// Login de usuario
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.name.value;
        const password = this.password.value;
        const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

        if (registeredUser && registeredUser.name === name && registeredUser.password === password) {
            localStorage.setItem('loggedInUser', name);
            alert('¡Inicio de sesión exitoso!');
            window.location.href = '/index.html';
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/login.html';
    });
}
 


// Carrito en cart.html
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
if (cartItems && totalPrice) {
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItems.innerHTML = "<p>No hay productos en el carrito.</p>";
            totalPrice.innerText = "";
        } else {
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <span>${item.name} - $${item.price} MXN</span>
                    <button class="remove-item-btn" onclick="removeItem(${index})">Eliminar</button>
                `;
                cartItems.appendChild(div);
                total += item.price;
            });
            totalPrice.innerText = `Total: $${total} MXN`;
        }
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    window.emptyCart = function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    window.simulatePayment = function() {
        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de pagar.");
        } else {
            alert("¡Pago realizado exitosamente! Gracias por tu compra.");
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    };

    

    renderCart();
}

