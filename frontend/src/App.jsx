import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "react-hot-toast";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import ProfileEdit from "./pages/ProfileEdit";
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<Products />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;