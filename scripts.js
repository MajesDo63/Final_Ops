// Carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel img');

setInterval(() => {
slides[currentSlide].classList.remove('active');
currentSlide = (currentSlide + 1) % slides.length;
slides[currentSlide].classList.add('active');
}, 3000);

// Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, price) {
cart.push({ name: product, price: price });
localStorage.setItem('cart', JSON.stringify(cart));
document.getElementById('cart-count').innerText = cart.length;
alert(`${product} agregado al carrito!`);
}

// Actualizar contador al cargar
window.onload = () => {
document.getElementById('cart-count').innerText = cart.length;
};