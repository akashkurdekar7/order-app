# Backend: Wholesale Order-App API 🚀

The backend for the **Wholesale Order-App** is built with Node.js, Express.js, and MongoDB. It handles authentication, inventory management, and order processing logic.

## 🛠️ Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **File Uploads**: Multer (for payment proofs)
- **Validation**: Mongoose Schemas

## 🔑 Key Models

### 1. User Model
Tracks shop information, owner details, and roles (User/Admin).
- `shopName`, `personName`, `location`, `aadhaar`, `phone`, `password`, `role`.

### 2. Product Model
Manages wholesale inventory.
- `name`, `image`, `price`, `stock`.

### 3. Order Model
Tracks the complete lifecycle of a wholesale transaction.
- `user`, `items` (Product & Qty), `totalAmount`, `status`, `paymentStatus`, `paymentMethod` (Cash/UPI), `paymentScreenshot`.

## 📜 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new wholesale shop. |
| POST | `/api/auth/login` | Secure shop login. |

### Products
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/products` | Get all available products. |
| POST | `/api/products` | [Admin] Add new wholesale inventory. |

### Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/orders` | Place a new order. |
| GET | `/api/orders/my` | Get current user's order history. |
| GET | `/api/orders/dashboard` | [Admin] Get all orders for the dashboard. |

## 🚀 Scripts

- `npm start`: Run the production server.
- `npm run dev`: Run the server with `nodemon` for development.

## 📂 Uploads
Payment screenshots are stored in the `/uploads` directory. Ensure this folder exists and is writable.
