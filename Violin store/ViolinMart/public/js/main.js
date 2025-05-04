
import { initRouter } from './router.js';
import { setupWebSocket } from './chat.js';
import { fetchCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    setupWebSocket();
    fetchCart();
});
