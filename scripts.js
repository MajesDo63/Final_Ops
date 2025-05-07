//Carrusel
let currentSlide = 0;
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-img');
const totalSlides = slides.length;

function updateWidth() {
    track.style.width = `${100 * totalSlides}%`;
    slides.forEach(slide => {
        slide.style.width = `${100 / totalSlides}%`;
    });
}

updateWidth();

setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    track.style.transform = `translateX(-${(100 / totalSlides) * currentSlide}%)`;
}, 5000);


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