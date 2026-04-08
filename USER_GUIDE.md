# User Guide: Multi-Vendor eCommerce Platform

Welcome to the **Multi-Vendor eCommerce Platform**! This guide explains all the features available on the website and provides a step-by-step walkthrough for both **Customers** and **Vendors**.

---

## 🌟 Overview of Features

The platform acts as a marketplace where multiple independent vendors can list their products, and customers can browse, add to cart, and purchase items seamlessly.

**Platform Features:**
- **User Roles:** Customers, Vendors, and Administrators.
- **Authentication:** Secure login and registration using JWT authentication.
- **Vendor System:** Users can apply to become vendors, manage their store profile, and list products.
- **Product & Category Management:** Vendors can add products, and customers can browse by categories or search for specific items.
- **Shopping Cart:** Secure, authenticated shopping cart that keeps your items saved.
- **Smart Checkout (Multi-Vendor Orders):** When checking out, a single cart with items from multiple vendors is automatically split into separate orders for each vendor.
- **Payments:** Secure and seamless checkout integration via **Paystack**.
- **Reviews & Ratings:** Customers can leave feedback and rate products they have purchased.

---

## 👤 For Customers

As a customer, you can browse products from various vendors, add them to your cart, and securely check out. 

### Step-by-Step Guide for Customers

#### 1. Registration & Login
- Click on the **Sign Up** or **Register** button on the home page.
- Fill in your details (Name, Email, Password) and submit.
- Once registered, **Log In** to access your dashboard, cart, and order history. 
> [!NOTE]
> *You must be logged in to add items to your cart and make purchases.*

#### 2. Browsing & Searching for Products
- **Homepage:** View featured products and latest arrivals.
- **Categories:** Use the categories menu to filter products by types like Electronics, Clothing, etc.
- **Search bar:** Looking for something specific? Type the product name to find it quickly.

#### 3. Adding to Cart & Shopping
- Once you find a product you like, click on it to view its details, description, and reviews.
- Select your desired quantity and click **Add to Cart**.
- A notification will confirm that the item is saved in your cart.
- You can review your cart at any time by clicking the **Cart** icon. Here, you can adjust quantities or remove items.

#### 4. Checkout & Payment
- Go to your Cart and click **Proceed to Checkout**.
- Provide your shipping information.
- The system will calculate the total price. Because this is a multi-vendor platform, buying from multiple vendors in one go is fully supported!
- Click **Pay with Paystack**. You will be redirected to the secure Paystack payment gateway.
- Enter your payment details (Card, Bank Transfer, etc.).
- Upon success, you will be redirected back, and your order will be confirmed!

#### 5. Managing Orders & Leaving Reviews
- Go to your **Profile / My Orders** section. 
- You can view the status of each of your orders here.
- Once you have received a product, go to the product page and leave a **Review** to help other customers.

---

## 🏪 For Vendors

Vendors can set up their own storefront and sell products to a large audience. 

### Step-by-Step Guide for Vendors

#### 1. Becoming a Vendor
- Register an account as a normal user.
- Go to your profile settings or dashboard and look for the **Become a Vendor** button.
- Fill out the Vendor Application form (Store Name, Description, and optionally upload a Logo).
- Once submitted, your vendor profile is created and you can start configuring your store!

#### 2. Managing Your Store Profile
- Go to the **Vendor Dashboard**.
- Navigate to **Store Settings**.
- Keep your store details updated to attract more customers. The `store_name` and `description` are visible to the public.

#### 3. Adding Products
- In the Vendor Dashboard, click **Add New Product**.
- Select the appropriate **Category**.
- Fill in the product details:
  - **Name & Description**
  - **Price**
  - **Initial Stock Quantity**
  - **Product Image**
- Click **Save/Publish**. Your product is now visible to all customers on the marketplace!

#### 4. Managing Received Orders
- When a customer purchases your product, you will receive an order.
- Navigate to your **Vendor Dashboard -> Orders**.
- You will see a list of orders specifically for **your** products. *(If a customer bought your item and another vendor's item, you only see the part of the order relevant to you).*
- You can click on individual orders to view the customer's shipping details.
- Update the **Order Status** (e.g., *Processing, Shipped, Delivered*) to keep your customers informed of their package's journey.

#### 5. Payments (Payouts)
- All initial payments go directly to the platform via Paystack.
- Payouts are handled administratively. The platform admin keeps track of successful orders and issues vendor payouts accordingly.

---

> [!TIP]
> **Need help?** If you encounter any bugs, make sure you are logged in correctly, or contact platform administration for assistance!
