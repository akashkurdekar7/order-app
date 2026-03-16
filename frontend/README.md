# Frontend: Wholesale Order-App (Vite + React) 🚀

The frontend for the **Wholesale Order-App** provides a modern, responsive, and multilingual interface for wholesale merchants and administrators.

## 🛠️ Technology Stack

- **Framework**: React (v19)
- **Bundler**: Vite
- **Styling**: Tailwind CSS (v4)
- **State Management**: React-Router & Hooks
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **Notifications**: React Hot Toast

## 💡 Key Features

### 1. Multilingual Support (i18n)
- Seamless switching between **English** and **Kannada**.
- Fully localized UI for better accessibility in local markets.

### 2. Wholesale Checkout Flow
- **Product Discovery**: Browse wholesale products with stock indicators.
- **Cart Logic**: Dynamic cart with real-time total calculations.
- **Payment Lifecycle**: UPI payment state with file upload for proof.

### 3. Progressive Web App (PWA)
- Optimized for mobile home screens.
- Installable and reliable performance via `vite-plugin-pwa`.

### 4. Admin Dashboard
- **Sales Intelligence**: Comprehensive revenue and volume tracking.
- **Inventory Control**: Update stock levels and manage product listings.
- **User Directory**: Contact and manage wholesale partners.

## 🚀 Performance & UI
- **Framer Motion**: Smooth transitions and interactive elements.
- **Tailwind CSS**: Modern design system with responsive layouts.

## 🏃 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📂 Structure
- `/src/api`: Axios configurations for backend communication.
- `/src/components`: Reusable UI elements (Buttons, Modals, Cards).
- `/src/pages`: Main application views (Profile, Dashboard, Orders).
- `/src/layouts`: Persistent layouts for Users and Admins.
