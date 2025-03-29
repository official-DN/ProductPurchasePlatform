/**
 * Payment page functionality
 * Handles form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    
    if (paymentForm) {
        // Form validation
        paymentForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate card number (simple check for demo purposes)
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(cardNumber)) {
                showError(cardNumberInput, 'Please enter a valid card number');
                isValid = false;
            } else {
                clearError(cardNumberInput);
            }
            
            // Validate expiry date (MM/YY format)
            if (!/^\d{2}\/\d{2}$/.test(expiryInput.value)) {
                showError(expiryInput, 'Please enter a valid expiry date (MM/YY)');
                isValid = false;
            } else {
                // Check if date is in the future
                const [month, year] = expiryInput.value.split('/');
                const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                const currentDate = new Date();
                
                if (expiryDate <= currentDate) {
                    showError(expiryInput, 'Card has expired');
                    isValid = false;
                } else {
                    clearError(expiryInput);
                }
            }
            
            // Validate CVV (3-4 digits)
            if (!/^\d{3,4}$/.test(cvvInput.value)) {
                showError(cvvInput, 'Please enter a valid CVV (3-4 digits)');
                isValid = false;
            } else {
                clearError(cvvInput);
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Format card number as the user types
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function() {
                // Remove non-digit characters
                let value = this.value.replace(/\D/g, '');
                
                // Add space after every 4 digits
                let formattedValue = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                
                // Update the input value
                this.value = formattedValue;
            });
        }
        
        // Format expiry date as the user types (MM/YY)
        if (expiryInput) {
            expiryInput.addEventListener('input', function() {
                // Remove non-digit characters
                let value = this.value.replace(/\D/g, '');
                
                // Add slash after first 2 digits
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                
                // Update the input value
                this.value = value;
            });
        }
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        // Remove any existing error
        clearError(input);
        
        // Add error class to input
        input.classList.add('is-invalid');
        
        // Create and append error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function clearError(input) {
        // Remove error class
        input.classList.remove('is-invalid');
        
        // Remove error message
        const errorDiv = input.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
});
