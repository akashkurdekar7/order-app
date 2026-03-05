import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminLayout = () => {
    return (
        <ProtectedRoute role="admin">
            <div className="min-h-screen bg-gray-100">
                <AdminNavbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default AdminLayout;
