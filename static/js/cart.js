/**
 * Cart management functionality
 * Handles cart state and UI updates
 */

// Cart state
let cart = [];

// Elements
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.getElementById('cartIcon');
const cartPreview = document.getElementById('cartPreview');
const closeCartPreview = document.getElementById('closeCartPreview');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// Initialize cart from session data
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/cart');
        const data = await response.json();
        
        if (data.cart) {
            cart = data.cart;
            updateCartUI();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
});

// Toggle cart preview
if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartPreview.classList.toggle('d-none');
    });
}

// Close cart preview
if (closeCartPreview) {
    closeCartPreview.addEventListener('click', function() {
        cartPreview.classList.add('d-none');
    });
}

// Clear cart
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your cart?')) {
            window.location.href = '/clear_cart';
        }
    });
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Update cart preview
    if (cartItems) {
        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.classList.remove('d-none');
            if (cartItems) cartItems.innerHTML = '';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            if (emptyCartMessage) emptyCartMessage.classList.add('d-none');
            if (checkoutBtn) checkoutBtn.disabled = false;
            
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-2 cart-item">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image me-2" style="width: 30px; height: 30px;">
                            <div>
                                <div class="fw-bold">${item.name}</div>
                                <div class="small">$${item.price.toFixed(2)} × ${item.quantity}</div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="me-2">$${itemTotal.toFixed(2)}</span>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary decrease-quantity" data-product-id="${item.id}">-</button>
                                <button class="btn btn-outline-secondary increase-quantity" data-product-id="${item.id}">+</button>
                                <button class="btn btn-outline-danger remove-item" data-product-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            if (cartItems) cartItems.innerHTML = itemsHTML;
            if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.decrease-quantity').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const productId = parseInt(this.dataset.productId);
                    const item = cart.find(item => item.id === productId);
                    
                    if (item && item.quantity > 1) {
                        await updateCartItem(productId, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const productId = parseInt(this.dataset.productId);
                    const item = cart.find(item => item.id === productId);
                    
                    if (item) {
                        await updateCartItem(productId, item.quantity + 1);
                    }
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const productId = parseInt(this.dataset.productId);
                    await updateCartItem(productId, 0);
                });
            });
        }
    }
}

// Update cart item
async function updateCartItem(productId, quantity) {
    try {
        const response = await fetch('/update_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            cart = data.cart;
            updateCartUI();
        } else {
            console.error('Error updating cart:', data.error);
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}
