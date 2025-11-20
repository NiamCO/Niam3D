// Product data
const products = [
    {
        id: 'infinity-cube',
        name: 'Infinity Cube',
        description: 'A mesmerizing fidget cube that folds and unfolds in infinite patterns. Perfect for keeping your hands busy and mind focused.',
        price: 24.99,
        image: 'images/ifcb.png'
    },
    {
        id: 'spiral-fidget',
        name: 'Spiral Fidget',
        description: 'Smooth spiral design that rotates effortlessly. Provides satisfying tactile feedback and visual stimulation.',
        price: 19.99,
        image: 'images/sppa.png'
    },
    {
        id: 'cone-fidget',
        name: 'Cone Fidget',
        description: 'Ergonomic cone-shaped fidget with multiple spinning rings. Designed for comfortable one-handed use.',
        price: 22.99,
        image: 'images/copa.png'
    },
    {
        id: 'shrektopus',
        name: 'Shrektopus',
        description: 'A unique hybrid creation combining everyone\'s favorite ogre with the flexibility of an octopus. Limited edition!',
        price: 29.99,
        image: 'images/shto.png'
    },
    {
        id: 'rocktopus',
        name: 'Rocktopus',
        description: 'Rock-solid octopus design with articulated legs. Each tentacle moves independently for maximum fidget potential.',
        price: 27.99,
        image: 'images/roto.png'
    },
    {
        id: 'shrek-action',
        name: 'Shrek Action Figure',
        description: 'Detailed 3D printed Shrek action figure with movable parts. A must-have for any Shrek enthusiast!',
        price: 34.99,
        image: 'images/shac.png'
    },
    {
        id: 'custom-request',
        name: 'Request Your Own',
        description: 'Have a unique idea? Let us bring your custom fidget design to life with our 3D printing expertise.',
        price: 'Custom',
        image: 'images/niam.png',
        custom: true
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('niam3d_cart')) || [];
let searchTerm = '';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const productModal = document.getElementById('productModal');
const customModal = document.getElementById('customModal');
const overlay = document.getElementById('overlay');
const orderDetails = document.getElementById('orderDetails');

// Initialize the application
function init() {
    renderProducts();
    updateCartCount();
    setupEventListeners();
}

// Render products grid
function renderProducts() {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Product card clicks
    productsGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId;
            const product = products.find(p => p.id === productId);
            if (product) {
                if (product.custom) {
                    openCustomModal();
                } else {
                    openProductModal(product);
                }
            }
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderProducts();
    });

    // Cart icon click
    document.querySelector('.cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    // Close modals
    document.querySelectorAll('.close-modal, .close-cart').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Overlay click
    overlay.addEventListener('click', closeAllModals);

    // Add to cart button in modal
    productModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.dataset.product;
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        }
    });

    // Cart item removal
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const productId = e.target.dataset.productId;
            removeFromCart(productId);
        }
    });

    // Checkout form submission
    document.querySelector('.checkout-form').addEventListener('submit', (e) => {
        if (cart.length === 0) {
            e.preventDefault();
            alert('Your cart is empty!');
            return;
        }
        orderDetails.value = generateOrderDetails();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Modal functions
function openProductModal(product) {
    document.getElementById('modalImg').src = product.image;
    document.getElementById('modalImg').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = product.price;
    document.querySelector('.add-to-cart').dataset.product = product.id;
    
    productModal.style.display = 'block';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCustomModal() {
    customModal.style.display = 'block';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCart() {
    renderCartItems();
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    productModal.style.display = 'none';
    customModal.style.display = 'none';
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cart functions
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    closeAllModals();
    
    // Show success feedback
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('niam3d_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-product-id="${item.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function generateOrderDetails() {
    return cart.map(item => 
        `${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n') + `\n\nTotal: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 4000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
