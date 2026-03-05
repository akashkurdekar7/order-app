import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/AdminLayout";
import { Toaster } from "react-hot-toast";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<MyOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          {/* <Route path="orders" element={<AdminOrders />} /> */}
          {/* <Route path="products" element={<Products />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;