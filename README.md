# 🛍️ SnapBuy – Full-Stack E-Commerce Web App

![SnapBuy Banner](https://res.cloudinary.com/dopcijwrw/image/upload/v1753793210/Screenshot_2025-07-14_191648_jdlfch.png)  
*A modern, full-featured e-commerce platform built with MERN Stack and Razorpay integration.*

---

## 🚀 Overview

**SnapBuy** is a full-stack e-commerce web application built for learning, experimentation, and showcasing full-stack development skills. It features secure authentication, shopping cart, order management, and an admin dashboard with product analytics.  

> ⚠️ **Note:** Razorpay integration is in **test mode only**. Live payments are disabled. For full functionality, please clone the repo and follow the setup steps below.

---

## 🛠️ Tech Stack

**Frontend:**  
- React  
- Redux Toolkit  
- Tailwind CSS  
- ShadCN UI  
- React Router  
- Framer Motion

**Backend:**  
- Node.js  
- Express  
- MongoDB  
- JWT (with cookies)  
- Razorpay (test mode)  
- Cloudinary (for product image uploads)

---

## ✨ Features

- 🔐 User Authentication (JWT with cookies)
- 🛒 Add to Cart, Remove, and Update Quantity
- 💳 Razorpay Payment Gateway (Test Mode)
- 🧾 Cash on Delivery Support
- 🎁 Smart Gift Coupon System (for orders above ₹5000)
- 🧑‍💼 Admin Dashboard (View sales, analytics, and manage products)
- 🔍 Product Search and Filters
- 📦 Order History & Status Tracking
- 🖼️ Cloudinary Image Upload
- 🔔 Notification for users
- 💬 Review System (for verified buyers)

---

## 🔐 Environment Variables

You will need to set up the following **`.env`** files:

### 📦 Backend `.env`

```env
PORT=
CORS_ORIGIN=http://localhost:5173
MONGO_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NODE_ENV=development
```

### 📦 Frontend `.env`

```env
VITE_RAZORPAY_KEY_ID=
````

# Backend setup
##  in the root folder
```
npm install
```

# Frontend setup
```
cd ../frontend
npm install
```

# ▶️ Run the Project
### in the root folder
```
npm run dev
```
### Start Frontend (in a new terminal)
```
cd frontend
npm run dev
```
