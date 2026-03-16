Wholesale Order Management System

A full-stack B2B Wholesale Order Management Platform built using the MERN Stack.

The system enables wholesale merchants to manage products, customers, orders, inventory, and payments through a centralized admin dashboard.

It streamlines the wholesale workflow and provides analytics for better business decisions.

Live Application

Frontend
https://order-app-olive.vercel.app/

Backend API
https://order-backend-c5em.onrender.com/

Table of Contents

Overview

Features

Screenshots

Technology Stack

Architecture

Project Structure

Installation

Environment Variables

API Overview

Deployment

Future Improvements

Author

License

Overview

The Wholesale Order Management System is designed for businesses handling bulk orders.

The platform helps merchants:

Manage product catalogs

Track inventory levels

Handle customer accounts

Process wholesale orders

Verify payments

Monitor sales analytics

The system includes a customer interface and an admin dashboard.

Features
Authentication & Security

JWT based authentication

Password hashing using bcrypt

Secure API endpoints

Role based access

Product Management

Add / edit / delete products

Manage product inventory

Product catalog browsing

Order Management

Place wholesale orders

Track order lifecycle

Order history management

Customer Management

Customer profile management

Customer order tracking

Payment Handling

UPI payment proof upload

Admin verification system

Admin Dashboard

Sales analytics

Customer management

Inventory tracking

Order management panel

User Experience

Fully responsive UI

Multilingual support via i18next

Screenshots
User Interface
<div align="center"> <img src="./frontend/public/screenshots/register.png" width="45%"> <img src="./frontend/public/screenshots/login.png" width="45%"> </div> <div align="center"> <img src="./frontend/public/screenshots/profile.png" width="45%"> <img src="./frontend/public/screenshots/customer-order-list.png" width="45%"> </div> <div align="center"> <img src="./frontend/public/screenshots/product.png" width="45%"> </div>
Admin Dashboard
<div align="center"> <img src="./frontend/public/screenshots/dashboard.png" width="45%"> <img src="./frontend/public/screenshots/orders.png" width="45%"> </div> <div align="center"> <img src="./frontend/public/screenshots/customers.png" width="45%"> <img src="./frontend/public/screenshots/inventory.png" width="45%"> </div> <div align="center"> <img src="./frontend/public/screenshots/sales.png" width="45%"> </div>
Technology Stack
Frontend

React (Vite)

Tailwind CSS

Axios

i18next (Multilingual support)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt.js

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Architecture
Client (React + Vite)
        |
        | REST API
        |
Backend (Node.js + Express)
        |
Database (MongoDB Atlas)

The frontend communicates with the backend using REST APIs.
Authentication is handled using JWT tokens, and data persistence is managed via MongoDB Atlas.

Project Structure
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
Installation
Clone Repository
git clone https://github.com/akashkurdekar7/order-app.git
cd order-app
Backend Setup
cd backend
npm install

Create .env file

PORT=9858
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret

Start the backend server

npm run dev
Frontend Setup
cd frontend
npm install
npm run dev

The frontend will run on:

http://localhost:5173
Environment Variables

Backend requires the following variables:

PORT
MONGODB_URI
JWT_SECRET
API Overview

Example endpoints:

Authentication
POST /api/auth/register
POST /api/auth/login
Products
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
Orders
POST /api/orders
GET /api/orders
Customers
GET /api/customers
Deployment
Frontend

Deployed using Vercel

Backend

Deployed using Render

Database

Hosted on MongoDB Atlas

Future Improvements

Online payment gateway integration

Real-time order updates

Advanced analytics dashboard

Email/SMS notifications

Role-based admin permissions

Mobile application

Author

Akash Kurdekar

GitHub
https://github.com/akashkurdekar7

LinkedIn
https://www.linkedin.com/in/akashkurdekar/

License

This project is licensed under the MIT License.