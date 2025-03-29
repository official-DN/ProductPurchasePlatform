import os
import logging
import json
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Sample product data - in a real application, this would come from a database
PRODUCTS = [
    {
        "id": 1,
        "name": "Premium Wireless Headphones",
        "price": 129.99,
        "description": "High-quality wireless headphones with noise cancellation technology and 20-hour battery life.",
        "image": "https://cdn.jsdelivr.net/gh/twbs/icons/icons/headphones.svg"
    },
    {
        "id": 2,
        "name": "Smart Fitness Tracker",
        "price": 79.99,
        "description": "Track your steps, heart rate, sleep quality and more with this water-resistant fitness tracker.",
        "image": "https://cdn.jsdelivr.net/gh/twbs/icons/icons/smartwatch.svg"
    },
    {
        "id": 3,
        "name": "Portable Bluetooth Speaker",
        "price": 49.99,
        "description": "Compact but powerful Bluetooth speaker with 10 hours of playback time and water resistance.",
        "image": "https://cdn.jsdelivr.net/gh/twbs/icons/icons/speaker.svg"
    },
    {
        "id": 4,
        "name": "Ultra HD Action Camera",
        "price": 199.99,
        "description": "Capture your adventures in stunning 4K with this durable, waterproof action camera.",
        "image": "https://cdn.jsdelivr.net/gh/twbs/icons/icons/camera.svg"
    }
]

@app.route('/')
def index():
    """Render the product selection page"""
    # Initialize the cart in the session if it doesn't exist
    if 'cart' not in session:
        session['cart'] = []
    
    return render_template('products.html', products=PRODUCTS, cart=session['cart'])

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    """Add a product to the cart"""
    try:
        data = request.get_json()
        product_id = int(data.get('product_id'))
        quantity = int(data.get('quantity', 1))
        
        if quantity <= 0:
            return jsonify({"error": "Quantity must be positive"}), 400
        
        # Find the product in our list
        product = next((p for p in PRODUCTS if p['id'] == product_id), None)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Initialize cart if needed
        if 'cart' not in session:
            session['cart'] = []
        
        # Check if product already in cart
        for item in session['cart']:
            if item['id'] == product_id:
                item['quantity'] += quantity
                session.modified = True
                return jsonify({"success": True, "cart": session['cart']}), 200
        
        # Add to cart with quantity
        cart_item = {
            "id": product['id'],
            "name": product['name'],
            "price": product['price'],
            "image": product['image'],
            "quantity": quantity
        }
        session['cart'].append(cart_item)
        session.modified = True
        
        return jsonify({"success": True, "cart": session['cart']}), 200
    except Exception as e:
        logging.error(f"Error adding to cart: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_cart', methods=['POST'])
def update_cart():
    """Update the cart quantity or remove items"""
    try:
        data = request.get_json()
        product_id = int(data.get('product_id'))
        quantity = int(data.get('quantity', 0))
        
        if 'cart' not in session:
            return jsonify({"error": "Cart is empty"}), 404
        
        if quantity <= 0:
            # Remove the item from cart
            session['cart'] = [item for item in session['cart'] if item['id'] != product_id]
        else:
            # Update quantity
            for item in session['cart']:
                if item['id'] == product_id:
                    item['quantity'] = quantity
                    break
        
        session.modified = True
        return jsonify({"success": True, "cart": session['cart']}), 200
    except Exception as e:
        logging.error(f"Error updating cart: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/cart')
def view_cart():
    """View the current cart"""
    if 'cart' not in session:
        session['cart'] = []
    
    return jsonify({"cart": session['cart']}), 200

@app.route('/payment')
def payment():
    """Render the payment page"""
    if 'cart' not in session or not session['cart']:
        flash("Your cart is empty. Please add some products first.")
        return redirect(url_for('index'))
    
    # Calculate cart total
    cart_total = sum(item['price'] * item['quantity'] for item in session['cart'])
    
    return render_template('payment.html', cart=session['cart'], cart_total=cart_total)

@app.route('/process_payment', methods=['POST'])
def process_payment():
    """Process the payment form submission"""
    if 'cart' not in session or not session['cart']:
        flash("Your cart is empty. Cannot process payment.")
        return redirect(url_for('index'))
    
    # In a real application, this would integrate with a payment gateway
    # and include more detailed validation
    
    # Basic form validation
    card_name = request.form.get('cardName')
    card_number = request.form.get('cardNumber')
    expiry = request.form.get('expiry')
    cvv = request.form.get('cvv')
    
    if not all([card_name, card_number, expiry, cvv]):
        flash("Please fill in all required payment fields.")
        return redirect(url_for('payment'))
    
    # In a real application, additional validation would occur here
    # along with actual payment processing
    
    # Clear the cart after successful payment
    session['cart'] = []
    flash("Payment successful! Your order has been processed.")
    return redirect(url_for('index'))

@app.route('/clear_cart')
def clear_cart():
    """Clear the entire cart"""
    session['cart'] = []
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
