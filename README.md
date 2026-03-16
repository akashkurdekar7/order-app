# Wholesale Order-App (MERN) 🚀

A **B2B Wholesale Management System** built using the MERN stack.
This application digitizes traditional wholesale order workflows, manages inventory, and provides analytics for merchants to efficiently handle orders and customers.

---

# 📸 Screenshots

## 👤 User Interface

<div align="center">
  <img src="./frontend/public/screenshots/register.png" width="45%" alt="User Registration"/>
  <img src="./frontend/public/screenshots/login.png" width="45%" alt="User Login"/>
</div>

<div align="center">
  <img src="./frontend/public/screenshots/profile.png" width="45%" alt="User Profile"/>
  <img src="./frontend/public/screenshots/customer-order-list.png" width="45%" alt="Customer Orders"/>
</div>

<div align="center">
  <img src="./frontend/public/screenshots/product.png" width="45%" alt="Product Catalog"/>
</div>

---

## 🛠️ Admin Dashboard

<div align="center">
  <img src="./frontend/public/screenshots/dashboard.png" width="45%" alt="Admin Dashboard"/>
  <img src="./frontend/public/screenshots/orders.png" width="45%" alt="Order Management"/>
</div>

<div align="center">
  <img src="./frontend/public/screenshots/customers.png" width="45%" alt="Customer Management"/>
  <img src="./frontend/public/screenshots/inventory.png" width="45%" alt="Inventory Management"/>
</div>

<div align="center">
  <img src="./frontend/public/screenshots/sales.png" width="45%" alt="Sales Analytics"/>
</div>

---

# 🌟 Key Features

* **Full MERN Stack** – MongoDB, Express.js, React, and Node.js
* **Multilingual Support** – English and Kannada using `i18next`
* **Wholesale Business Logic** – Designed specifically for B2B wholesale workflows
* **Inventory Management** – Track product stock and manage inventory in real time
* **Order Lifecycle Tracking** – Monitor orders from processing to delivery
* **Payment Verification** – Upload UPI payment proof with admin approval
* **Admin Dashboard** – Manage customers, products, and sales insights
* **Progressive Web App (PWA)** – Mobile-friendly and installable

---

# ⚡ Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* Axios
* i18next

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js

## Deployment

* Vercel (Frontend)
* MongoDB Atlas

---

# 📁 Project Structure

```
order-app/
│
├── backend/            # Express.js API & server
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── uploads/        # Payment screenshots
│
├── frontend/           # React client (Vite)
│   ├── src/
│   │   ├── api/        # Axios API calls
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # User & Admin views
│   │   └── i18n.js     # Multilingual configuration
│
└── documentation       # API notes & references
```

---

# 🛠️ Getting Started

## Prerequisites

* Node.js (v18+)
* MongoDB (Local or Atlas)
* npm or yarn

---

## Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/akashkurdekar7/order-app.git
cd order-app
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside **backend** folder:

```
PORT=9858
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create `.env` inside **backend folder**.

| Variable    | Description                   |
| ----------- | ----------------------------- |
| PORT        | Backend server port           |
| MONGODB_URI | MongoDB database connection   |
| JWT_SECRET  | Secret key for authentication |

---

# 🔗 Links

**GitHub Repository**
https://github.com/akashkurdekar7/order-app

**Live Demo**
https://order-app-olive.vercel.app/

---

# 📞 Contact

**GitHub**
https://github.com/akashkurdekar7

**LinkedIn**
https://www.linkedin.com/in/akashkurdekar/

---

# 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for more details.
