// State management
let cartItems = [];
let products = [];

// DOM Elements
const cartCount = document.getElementById('cart-count');
const productsGrid = document.getElementById('products-grid');
const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const messageInput = document.getElementById('message-input');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

// Event Listeners
chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
});

sendMessage.addEventListener('click', sendChatMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});


// Cart functions
async function fetchCart() {
    try {
        const response = await fetch('/api/cart', {
            credentials: 'include'
        });
        cartItems = await response.json();
        updateCartCount();
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

async function addToCart(product) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                productId: product.id,
                quantity: 1
            }),
        });

        if (response.ok) {
            await fetchCart();
            showToast(`${product.name} has been added to your cart`);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

function updateCartCount() {
    cartCount.textContent = cartItems.length;
}

// Product functions
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${JSON.stringify(product)})" class="add-to-cart">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Chat functions
function sendChatMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    messageInput.value = '';

    // Send to server
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        appendMessage('system', data.message);
    })
    .catch(console.error);
}

function appendMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize
fetchCart();
fetchProducts();