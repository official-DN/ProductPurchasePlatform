/**
 * Product page functionality
 * Handles adding products to cart
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const productId = parseInt(this.dataset.productId);
            const quantityInput = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            const quantity = parseInt(quantityInput.value);
            
            if (quantity > 0) {
                try {
                    const response = await fetch('/add_to_cart', {
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
                        // Update cart
                        cart = data.cart;
                        updateCartUI();
                        
                        // Show success message
                        const btn = this;
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-check me-1"></i> Added!';
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-success');
                        
                        // Reset button after 2 seconds
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.classList.remove('btn-success');
                            btn.classList.add('btn-primary');
                        }, 2000);
                        
                        // Reset quantity to 1
                        quantityInput.value = '1';
                        
                        // Show cart preview
                        document.getElementById('cartPreview').classList.remove('d-none');
                    } else {
                        console.error('Error adding to cart:', data.error);
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                }
            }
        });
    });
    
    // Quantity input validation
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Ensure value is a number and within range
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = '1';
            } else if (value > 10) {
                this.value = '10';
            }
        });
    });
});
