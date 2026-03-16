![MERN](https://img.shields.io/badge/stack-MERN-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
# Wholesale Order Management System

A full-stack **B2B Wholesale Order Management Platform** built using the
**MERN Stack**.

The system enables wholesale merchants to manage **products, customers,
orders, inventory, and payments** through a centralized admin dashboard.

------------------------------------------------------------------------

## Live Application

**Frontend**\
https://order-app-olive.vercel.app/

**Backend API**\
https://order-backend-c5em.onrender.com/

## Admin Access
**Phone:** 9000000001  
**Password:** admin123  

## Customer Access
**Phone:** 9000000002  
**Password:** user123

------------------------------------------------------------------------

# Table of Contents

-   Overview
-   Features
-   Screenshots
-   Technology Stack
-   Architecture
-   Project Structure
-   Installation
-   Environment Variables
-   API Overview
-   Deployment
-   Future Improvements
-   Author
-   License

------------------------------------------------------------------------

# Overview

The **Wholesale Order Management System** helps businesses manage
wholesale orders, products, customers, and inventory efficiently.

It includes a **customer interface** for placing orders and an **admin
dashboard** for managing the entire business workflow.

------------------------------------------------------------------------

# Features

## Authentication & Security

-   JWT-based authentication
-   Password hashing with bcrypt
-   Secure API endpoints

## Product Management

-   Add / update / delete products
-   Product catalog browsing
-   Inventory tracking

## Order Management

-   Create and track wholesale orders
-   Order history management

## Customer Management

-   Customer profiles
-   Order tracking per customer

## Payment Handling

-   UPI payment proof upload
-   Admin verification

## Admin Dashboard

-   Sales analytics
-   Inventory monitoring
-   Customer management

## User Experience

-   Responsive UI
-   Multilingual support with i18next

------------------------------------------------------------------------
# Screenshots
### Dashboard:
<div align="center">
<img src="frontend/public/screenshots/dashboard.png" width="800"/>
</div>
<div align="center">
<img src="frontend/public/screenshots/orders.png" width="800"/>
</div>
<div align="center">
<img src="frontend/public/screenshots/customers.png" width="800"/>
</div>
<div align="center">
<img src="frontend/public/screenshots/inventory.png" width="800"/>
</div>
<div align="center">
<img src="frontend/public/screenshots/sales.png" width="800"/>
</div>

# Technology Stack

## Frontend

-   React (Vite)
-   Tailwind CSS
-   Axios
-   i18next

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   bcrypt.js

## Deployment

-   Frontend: Vercel
-   Backend: Render
-   Database: MongoDB Atlas

------------------------------------------------------------------------

# Architecture

Client (React + Vite) → REST API → Backend (Node.js + Express) → MongoDB
Atlas

------------------------------------------------------------------------

# Project Structure

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

------------------------------------------------------------------------

# Installation

## Clone Repository

``` bash
git clone https://github.com/akashkurdekar7/order-app.git
cd order-app
```

------------------------------------------------------------------------

# Backend Setup

``` bash
cd backend
npm install
```

Create `.env` file

    PORT=9858
    MONGODB_URI=your_mongodb_connection
    JWT_SECRET=your_secret

Run backend

``` bash
npm run dev
```

------------------------------------------------------------------------

# Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

    http://localhost:5173

------------------------------------------------------------------------

# Environment Variables

Backend requires:

    PORT
    MONGODB_URI
    JWT_SECRET

------------------------------------------------------------------------

# API Overview

## Authentication

    POST /api/auth/register
    POST /api/auth/login

## Products

    GET /api/products
    POST /api/products
    PUT /api/products/:id
    DELETE /api/products/:id

## Orders

    POST /api/orders
    GET /api/orders

## Customers

    GET /api/customers

------------------------------------------------------------------------

# Deployment

Frontend deployed on **Vercel**\
Backend deployed on **Render**\
Database hosted on **MongoDB Atlas**

------------------------------------------------------------------------

# Future Improvements

-   Payment gateway integration
-   Real-time order tracking
-   Email notifications
-   Advanced analytics dashboard
-   Mobile application

------------------------------------------------------------------------

# Author

**Akash Kurdekar**

GitHub\
https://github.com/akashkurdekar7

LinkedIn\
https://www.linkedin.com/in/akashkurdekar/

------------------------------------------------------------------------

# License

Licensed under the **MIT License**.
