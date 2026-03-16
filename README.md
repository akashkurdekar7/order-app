# Wholesale Order Management System

A full-stack **B2B wholesale order management platform** built with the MERN stack.
The system helps wholesale merchants manage products, customers, orders, and inventory through a centralized dashboard.

---

## Live Application

Frontend
https://order-app-olive.vercel.app/

Backend API
https://order-backend-c5em.onrender.com/

---

## Screenshots

### User Interface

<div align="center">
<img src="./frontend/public/screenshots/register.png" width="45%">
<img src="./frontend/public/screenshots/login.png" width="45%">
</div>

<div align="center">
<img src="./frontend/public/screenshots/profile.png" width="45%">
<img src="./frontend/public/screenshots/customer-order-list.png" width="45%">
</div>

<div align="center">
<img src="./frontend/public/screenshots/product.png" width="45%">
</div>

### Admin Dashboard

<div align="center">
<img src="./frontend/public/screenshots/dashboard.png" width="45%">
<img src="./frontend/public/screenshots/orders.png" width="45%">
</div>

<div align="center">
<img src="./frontend/public/screenshots/customers.png" width="45%">
<img src="./frontend/public/screenshots/inventory.png" width="45%">
</div>

<div align="center">
<img src="./frontend/public/screenshots/sales.png" width="45%">
</div>

---

## Features

* User authentication with JWT
* Product catalog management
* Customer management system
* Inventory tracking
* Order lifecycle management
* UPI payment proof upload and verification
* Admin dashboard with analytics
* Multilingual support using i18next
* Responsive UI

---

## Technology Stack

### Frontend

React (Vite)
Tailwind CSS
Axios
i18next

### Backend

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcrypt.js

### Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

---

## Project Structure

```
order-app
│
├── backend
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   └── uploads
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── i18n.js
│
└── documentation
```

---

## Local Development

### Clone the repository

```bash
git clone https://github.com/akashkurdekar7/order-app.git
cd order-app
```

### Backend setup

```bash
cd backend
npm install
```

Create `.env`

```
PORT=9858
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

Run backend

```
npm run dev
```

### Frontend setup

```
cd ../frontend
npm install
npm run dev
```

---

## Environment Variables

Backend requires:

PORT
MONGODB_URI
JWT_SECRET

---

## Author

Akash Kurdekar

GitHub
https://github.com/akashkurdekar7

LinkedIn
https://www.linkedin.com/in/akashkurdekar/

---

## License

This project is licensed under the MIT License.
