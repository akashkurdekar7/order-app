import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";

const UserLayout = () => {
    return (
        <ProtectedRoute role="user">
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default UserLayout;
