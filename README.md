# ProductPurchasePlatform
This is two page website , product add-to-cart and payment get way using python-flask.  


# E-Commerce Checkout Flow

A simple two-page e-commerce checkout flow built with Flask and vanilla JavaScript.

## Features

- **Product Selection Page**
  - Browse and view available products
  - Add products to cart with quantity selection
  - Interactive cart preview with real-time updates
  - Adjust quantities or remove items directly from cart

- **Payment Gateway Page**
  - Complete checkout form with billing information
  - Credit card information entry with validation
  - Order summary showing all cart items and total
  - Form validation for payment details

## Technology Stack

- **Backend**
  - Flask (Python web framework)
  - Flask session management for cart storage
  - RESTful API endpoints for cart operations

- **Frontend**
  - HTML5, CSS3, JavaScript (vanilla)
  - Bootstrap for responsive design
  - Font Awesome for icons

## Project Structure

```
├── static/                 # Static assets
│   ├── css/                # CSS stylesheets
│   │   └── styles.css      # Custom styles
│   └── js/                 # JavaScript files
│       ├── cart.js         # Cart management functionality
│       ├── payment.js      # Payment form validation
│       └── products.js     # Product page functionality
├── templates/              # HTML templates
│   ├── layout.html         # Base template with common elements
│   ├── payment.html        # Payment page template
│   └── products.html       # Product listing template
├── app.py                  # Flask application with routes
└── main.py                 # Entry point for the application
```

## How to Run

1. Make sure you have Python installed
2. Install the required dependencies:
   ```
   pip install flask gunicorn
   ```
3. Start the application:
   ```
   python main.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Usage Flow

1. Browse the products on the homepage
2. Add items to your cart using the "Add to Cart" button
3. Adjust quantities as needed in the cart preview
4. Click "Proceed to Checkout" to go to the payment page
5. Fill in your billing details and payment information
6. Click "Complete Payment" to process your order

## Screenshots

- Product Selection Page: Users can browse products and add them to cart
- Cart Preview: Shows current items in cart with quantity controls
- Payment Page: Form for entering shipping and payment details
- Order Summary: Shows all items in cart with calculated total

## Future Enhancements

- User authentication and account management
- Product categories and search functionality
- Payment gateway integration (Stripe, PayPal)
- Order history and tracking
- Admin panel for product management
