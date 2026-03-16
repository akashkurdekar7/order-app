# Wholesale Order-App (MERN) 🚀

A comprehensive B2B Wholesale Management System built with the MERN stack. This application digitizes manual order workflows, tracks inventory, and provides business intelligence for wholesale merchants.

---

## 📸 Screenshots

> [!TIP]
> Add images of your application here to make it visually appealing!

| User Dashboard | Admin Console |
| :---: | :---: |
| ![User Dashboard](https://via.placeholder.com/400x250?text=User+Dashboard+Screenshot) | ![Admin Console](https://via.placeholder.com/400x250?text=Admin+Console+Screenshot) |

| Multilingual Toggle | Order Tracking |
| :---: | :---: |
| ![Language Support](https://via.placeholder.com/400x250?text=Kannada+Support+Screenshot) | ![Order History](https://via.placeholder.com/400x250?text=Order+Tracking+Screenshot) |

---

## 🌟 Key Features

- **Full MERN Stack**: Built with MongoDB, Express.js, React, and Node.js.
- **Multilingual Support**: Fully localized in English and Kannada using `i18next`.
- **B2B Logic**: Specialized workflows for wholesale transactions, including GST/Aadhaar verification.
- **Inventory Management**: Real-time stock tracking and low-stock alerts.
- **Order Lifecycle**: Complete tracking from "Processing" to "Delivered".
- **Payment Verification**: UPI payment screenshot upload and admin validation.
- **PWA Ready**: Mobile-friendly and installable as a Progressive Web App.

## 📁 Project Structure

```text
order-app/
├── backend/            # Express.js server & Node.js API
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic for routes
│   ├── models/         # Mongoose schemas (User, Product, Order)
│   ├── routes/         # API endpoint definitions
│   └── uploads/        # Local storage for payment proofs
├── frontend/           # React.js client (Vite)
│   ├── src/
│   │   ├── api/        # Axios instances & API calls
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views (User & Admin)
│   │   └── i18n.js     # Multilingual configurations
└── documentation       # Raw API reference & notes
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd order_app
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables needed
   npm run dev
   ```

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🔐 Environment Variables

Ensure you have a `.env` file in the `backend/` directory with the following:

- `PORT`: Server port (default: 9858)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for authentication
## 📸 Application Screenshots

### Authentication
| Register | Login |
|---|---|
| ![](frontend/public/screenshots/register.png) | ![](frontend/public/screenshots/login.png) |

### User Panel
| Product Catalog | Profile |
|---|---|
| ![](frontend/public/screenshots/product.png) | ![](frontend/public/screenshots/profile.png) |

| Orders |
|---|
| ![](frontend/public/screenshots/orders.png) |

### Admin Panel
| Dashboard | Inventory |
|---|---|
| ![](frontend/public/screenshots/dashboard.png) | ![](frontend/public/screenshots/inventory.png) |

| Customers | Sales Analytics |
|---|---|
| ![](frontend/public/screenshots/customers.png) | ![](frontend/public/screenshots/sales.png) |
## 🔗 Links

- **GitHub Repository**: [https://github.com/akashkurdekar7/order-app.git](https://github.com/akashkurdekar7/order-app.git)
- **Live Demo**: *Coming Soon*

## 📞 Contact

- **GitHub**: [@akashkurdekar7](https://github.com/akashkurdekar7)
- **LinkedIn**: [Akash Kurdekar](https://www.linkedin.com/in/akash-kurdekar/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
