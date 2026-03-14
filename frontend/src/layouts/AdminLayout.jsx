import {Outlet} from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";

const AdminLayout = () => {
  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-slate-50/50">
        <AdminNavbar />
        <main className="pt-28">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
